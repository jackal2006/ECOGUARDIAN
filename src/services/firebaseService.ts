import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import {
  UserProfile,
  PollutionReport,
  EcoChallenge,
  ChallengeCompletion,
  Article,
  CommunityEvent,
  ReportStatus,
} from '../types';
import {
  DEFAULT_CHALLENGES,
  DEFAULT_ARTICLES,
  DEFAULT_COMMUNITY_EVENTS,
  DEMO_POLLUTION_REPORTS,
  INITIAL_BADGES,
} from '../data/mockData';

// Helper to determine badges from eco points
export function calculateBadges(points: number): string[] {
  return INITIAL_BADGES.filter((b) => points >= b.pointsRequired).map((b) => b.id);
}

// User Profile Operations
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      createdAt: profile.createdAt || new Date().toISOString(),
    });

    // If designated admin, establish admin authorization doc
    if (profile.role === 'admin' || profile.email === 'rahigudeviddesh7@gmail.com') {
      try {
        await setDoc(doc(db, 'admins', profile.uid), {
          uid: profile.uid,
          email: profile.email,
          createdAt: new Date().toISOString(),
        });
      } catch (adminErr) {
        console.warn('Admin doc creation notice:', adminErr);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function awardEcoPoints(
  uid: string,
  pointsToAdd: number,
  isReport: boolean = false,
  isChallenge: boolean = false
): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;

    const currentData = snap.data() as UserProfile;
    const newPoints = (currentData.ecoPoints || 0) + pointsToAdd;
    const newBadges = calculateBadges(newPoints);
    const updatedReports = isReport ? (currentData.reportsCount || 0) + 1 : (currentData.reportsCount || 0);
    const updatedChallenges = isChallenge ? (currentData.challengesCount || 0) + 1 : (currentData.challengesCount || 0);

    const updatePayload: Partial<UserProfile> = {
      ecoPoints: newPoints,
      badges: newBadges,
      reportsCount: updatedReports,
      challengesCount: updatedChallenges,
    };

    await updateDoc(userDocRef, updatePayload);
    return { ...currentData, ...updatePayload };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return null;
  }
}

// Pollution Reports Operations
export async function optimizeImageDataUrl(dataUrl: string, maxWidth: number = 800, quality: number = 0.75): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) return dataUrl;
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

export async function uploadReportImage(reportId: string, dataUrl: string): Promise<string> {
  // If dataUrl is already an external URL, return directly
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
    return dataUrl;
  }

  // Fast optimization to prevent giant payloads
  const optimized = await optimizeImageDataUrl(dataUrl);

  // Non-blocking race condition for Storage (max 900ms)
  const uploadPromise = (async () => {
    try {
      const storageRef = ref(storage, `pollution-reports/${reportId}-${Date.now()}.jpg`);
      await uploadString(storageRef, optimized, 'data_url');
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch {
      return optimized;
    }
  })();

  const timeoutPromise = new Promise<string>((resolve) =>
    setTimeout(() => resolve(optimized), 900)
  );

  return Promise.race([uploadPromise, timeoutPromise]);
}

export async function submitPollutionReport(reportData: Omit<PollutionReport, 'id' | 'createdAt' | 'status'>): Promise<PollutionReport> {
  const customId = `rep-${Date.now()}`;
  const path = `pollutionReports/${customId}`;
  
  let imageUrl = reportData.imageUrl || '';
  if (imageUrl && imageUrl.startsWith('data:image')) {
    imageUrl = await uploadReportImage(reportData.reportId, imageUrl);
  }

  const finalReport: PollutionReport = {
    ...reportData,
    id: customId,
    imageUrl,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  // 1. Immediately cache in local storage so it is 100% available with zero delay
  try {
    const existingRaw = localStorage.getItem('eco_user_submitted_reports');
    const existing: PollutionReport[] = existingRaw ? JSON.parse(existingRaw) : [];
    const deduped = [finalReport, ...existing.filter((r) => r.reportId !== finalReport.reportId)];
    localStorage.setItem('eco_user_submitted_reports', JSON.stringify(deduped));
  } catch (cacheErr) {
    console.warn('Local report caching notice:', cacheErr);
  }

  // 2. Persist to Firestore
  try {
    await setDoc(doc(db, 'pollutionReports', customId), finalReport);

    // Award +25 Eco Points for active civic reporting
    if (reportData.userId && reportData.userId !== 'anonymous') {
      try {
        await awardEcoPoints(reportData.userId, 25, true, false);
      } catch (awardErr) {
        console.warn('Could not auto-award points to user profile:', awardErr);
      }
    }

    return finalReport;
  } catch (error) {
    console.warn('Firestore write notice (saved in local store):', error);
    // Still return the report so the user's flow is never blocked
    return finalReport;
  }
}

export function subscribeToReports(
  callback: (reports: PollutionReport[]) => void,
  filterType?: string
) {
  const path = 'pollutionReports';
  try {
    const colRef = collection(db, 'pollutionReports');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const localStoredRaw = localStorage.getItem('eco_user_submitted_reports');
        const localReports: PollutionReport[] = localStoredRaw ? JSON.parse(localStoredRaw) : [];

        if (snapshot.empty) {
          const merged = [...localReports, ...DEMO_POLLUTION_REPORTS];
          const seen = new Set<string>();
          const unique = merged.filter((item) => {
            if (seen.has(item.reportId)) return false;
            seen.add(item.reportId);
            return true;
          });
          unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(unique);
          return;
        }

        const reports: PollutionReport[] = [];
        snapshot.forEach((docSnap) => {
          reports.push({ id: docSnap.id, ...(docSnap.data() as Omit<PollutionReport, 'id'>) });
        });

        // Merge with local persistent reports so newly submitted reports never disappear
        const combined = [...localReports, ...reports];
        const seen = new Set<string>();
        const unique = combined.filter((item) => {
          if (seen.has(item.reportId)) return false;
          seen.add(item.reportId);
          return true;
        });

        // Sort descending by creation
        unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(unique);
      },
      (error) => {
        console.warn('Reports snapshot notice, using local merged store:', error);
        const localStoredRaw = localStorage.getItem('eco_user_submitted_reports');
        const localReports: PollutionReport[] = localStoredRaw ? JSON.parse(localStoredRaw) : [];
        const combined = [...localReports, ...DEMO_POLLUTION_REPORTS];
        combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(combined);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function updateReportStatus(reportId: string, status: ReportStatus, adminNotes?: string): Promise<void> {
  const path = `pollutionReports/${reportId}`;
  try {
    const docRef = doc(db, 'pollutionReports', reportId);
    await updateDoc(docRef, {
      status,
      ...(adminNotes ? { adminNotes } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  const path = `pollutionReports/${reportId}`;
  try {
    await deleteDoc(doc(db, 'pollutionReports', reportId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Eco Challenges Operations
export async function getChallenges(): Promise<EcoChallenge[]> {
  const path = 'challenges';
  try {
    const snap = await getDocs(collection(db, 'challenges'));
    if (snap.empty) {
      // Seed default challenges into Firestore
      for (const ch of DEFAULT_CHALLENGES) {
        try {
          await setDoc(doc(db, 'challenges', ch.id), ch);
        } catch {
          // ignore seed errors
        }
      }
      return DEFAULT_CHALLENGES;
    }
    const list: EcoChallenge[] = [];
    snap.forEach((d) => list.push(d.data() as EcoChallenge));
    return list;
  } catch (error) {
    console.warn('Error reading challenges from Firestore, using defaults:', error);
    return DEFAULT_CHALLENGES;
  }
}

export async function getUserCompletedChallengeIds(userId: string): Promise<string[]> {
  const path = 'challengeCompletions';
  try {
    const q = query(collection(db, 'challengeCompletions'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => (d.data() as ChallengeCompletion).challengeId);
  } catch (error) {
    console.warn('Notice querying completions:', error);
    return [];
  }
}

export async function completeEcoChallenge(
  userId: string,
  challenge: EcoChallenge
): Promise<{ completion: ChallengeCompletion; updatedUser: UserProfile | null }> {
  const completionId = `comp-${userId}-${challenge.id}`;
  const path = `challengeCompletions/${completionId}`;

  const completion: ChallengeCompletion = {
    id: completionId,
    userId,
    challengeId: challenge.id,
    completedAt: new Date().toISOString(),
    pointsEarned: challenge.points,
    challengeTitle: challenge.title,
  };

  try {
    await setDoc(doc(db, 'challengeCompletions', completionId), completion);
    const updatedUser = await awardEcoPoints(userId, challenge.points, false, true);
    return { completion, updatedUser };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function saveChallenge(challenge: EcoChallenge): Promise<void> {
  const path = `challenges/${challenge.id}`;
  try {
    await setDoc(doc(db, 'challenges', challenge.id), challenge);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteChallenge(challengeId: string): Promise<void> {
  const path = `challenges/${challengeId}`;
  try {
    await deleteDoc(doc(db, 'challenges', challengeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Articles Operations
export async function getArticles(): Promise<Article[]> {
  const path = 'articles';
  try {
    const snap = await getDocs(collection(db, 'articles'));
    if (snap.empty) {
      for (const a of DEFAULT_ARTICLES) {
        try {
          await setDoc(doc(db, 'articles', a.id), a);
        } catch {
          // ignore
        }
      }
      return DEFAULT_ARTICLES;
    }
    const list: Article[] = [];
    snap.forEach((d) => list.push(d.data() as Article));
    return list;
  } catch (error) {
    console.warn('Error reading articles, using defaults:', error);
    return DEFAULT_ARTICLES;
  }
}

export async function saveArticle(article: Article): Promise<void> {
  const path = `articles/${article.id}`;
  try {
    await setDoc(doc(db, 'articles', article.id), article);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteArticle(articleId: string): Promise<void> {
  const path = `articles/${articleId}`;
  try {
    await deleteDoc(doc(db, 'articles', articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Community Events Operations
export async function getCommunityEvents(): Promise<CommunityEvent[]> {
  const path = 'events';
  try {
    const snap = await getDocs(collection(db, 'events'));
    if (snap.empty) {
      for (const ev of DEFAULT_COMMUNITY_EVENTS) {
        try {
          await setDoc(doc(db, 'events', ev.id), ev);
        } catch {
          // ignore
        }
      }
      return DEFAULT_COMMUNITY_EVENTS;
    }
    const list: CommunityEvent[] = [];
    snap.forEach((d) => list.push(d.data() as CommunityEvent));
    return list;
  } catch (error) {
    console.warn('Error reading community events, using defaults:', error);
    return DEFAULT_COMMUNITY_EVENTS;
  }
}

export async function joinCommunityEvent(eventId: string, userId: string): Promise<void> {
  const path = `events/${eventId}`;
  try {
    const docRef = doc(db, 'events', eventId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as CommunityEvent;
      const participants = data.participants || [];
      if (!participants.includes(userId)) {
        await updateDoc(docRef, {
          participantsCount: (data.participantsCount || 0) + 1,
          participants: [...participants, userId],
        });
        // Award points for participating in a community activity
        await awardEcoPoints(userId, 30);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Database Seeder for rich initial state
export async function initializeDatabaseSeed(): Promise<void> {
  try {
    // Seed initial reports if collection is empty
    const reportSnap = await getDocs(collection(db, 'pollutionReports'));
    if (reportSnap.empty) {
      for (const rep of DEMO_POLLUTION_REPORTS) {
        await setDoc(doc(db, 'pollutionReports', rep.id), rep);
      }
    }
  } catch (err) {
    console.warn('Seed operation completed with local fallback availability.');
  }
}

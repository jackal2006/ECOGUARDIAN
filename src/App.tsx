/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { testConnection } from './firebase';
import {
  subscribeToReports,
  getChallenges,
  getArticles,
  getCommunityEvents,
  getUserCompletedChallengeIds,
  initializeDatabaseSeed,
} from './services/firebaseService';
import {
  PollutionReport,
  EcoChallenge,
  Article,
  CommunityEvent,
} from './types';
import {
  DEMO_POLLUTION_REPORTS,
  DEFAULT_CHALLENGES,
  DEFAULT_ARTICLES,
  DEFAULT_COMMUNITY_EVENTS,
} from './data/mockData';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './components/HomePage';
import { ReportPollutionPage } from './components/ReportPollutionPage';
import { PollutionReportsDashboard } from './components/PollutionReportsDashboard';
import { AIWasteIdentifierPage } from './components/AIWasteIdentifierPage';
import { WasteGuidePage } from './components/WasteGuidePage';
import { EcoChallengesPage } from './components/EcoChallengesPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ExplorePage } from './components/ExplorePage';
import { AboutPage } from './components/AboutPage';

const EcoGuardianApp: React.FC = () => {
  const { userProfile, currentUser } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Data Collections with immediate local persistence
  const [reports, setReports] = useState<PollutionReport[]>(() => {
    try {
      const stored = localStorage.getItem('eco_user_submitted_reports');
      const local = stored ? JSON.parse(stored) : [];
      return [...local, ...DEMO_POLLUTION_REPORTS];
    } catch {
      return DEMO_POLLUTION_REPORTS;
    }
  });
  const [challenges, setChallenges] = useState<EcoChallenge[]>(DEFAULT_CHALLENGES);
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>(DEFAULT_COMMUNITY_EVENTS);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(['chal-1']);

  // Prefill State for "Report this Waste" from AI Waste Identifier
  const [reportPrefillData, setReportPrefillData] = useState<{
    category?: string;
    detectedItem?: string;
    imageUrl?: string;
    description?: string;
  } | null>(null);

  // Initialize and subscribe
  useEffect(() => {
    // 1. Test Firestore Connection (as mandated by Firebase integration skill)
    testConnection();

    // 2. Initialize Seed if necessary
    initializeDatabaseSeed();

    // 3. Real-time Reports Subscription
    const unsubscribe = subscribeToReports((updatedReports) => {
      setReports(updatedReports);
    });

    // 4. Fetch Challenges, Articles, Events
    const loadAppData = async () => {
      try {
        const [loadedChallenges, loadedArticles, loadedEvents] = await Promise.all([
          getChallenges(),
          getArticles(),
          getCommunityEvents(),
        ]);
        if (loadedChallenges?.length) setChallenges(loadedChallenges);
        if (loadedArticles?.length) setArticles(loadedArticles);
        if (loadedEvents?.length) setCommunityEvents(loadedEvents);
      } catch (err) {
        console.warn('Using baseline mock datasets:', err);
      }
    };

    loadAppData();

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Fetch completed challenges for current user
  useEffect(() => {
    const fetchUserCompletions = async () => {
      const uid = currentUser?.uid || userProfile?.uid;
      if (uid) {
        try {
          const ids = await getUserCompletedChallengeIds(uid);
          if (ids.length) {
            setCompletedChallengeIds(ids);
          }
        } catch {
          // ignore
        }
      }
    };
    fetchUserCompletions();
  }, [currentUser, userProfile]);

  // Handler when report is submitted
  const handleReportSubmitted = (newReport: PollutionReport) => {
    setReports((prev) => [newReport, ...prev]);
    // Clear prefill
    setReportPrefillData(null);
  };

  // Handler when challenge is completed
  const handleChallengeCompleted = (challenge: EcoChallenge) => {
    setCompletedChallengeIds((prev) => [...prev, challenge.id]);
  };

  // Handler for prefilling report from AI Waste Identifier
  const handleReportWasteFromAI = (prefillData: {
    category: string;
    detectedItem: string;
    imageUrl: string;
    description: string;
  }) => {
    setReportPrefillData(prefillData);
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reloadAllData = async () => {
    const [ch, ar] = await Promise.all([getChallenges(), getArticles()]);
    setChallenges(ch);
    setArticles(ar);
  };

  // Derived user reports: includes user's submissions, local submitted reports, and demo reports
  const userReports = reports.filter((r) => {
    if (!r) return false;
    if (userProfile && (r.userId === userProfile.uid || r.userEmail === userProfile.email)) return true;
    if (currentUser && (r.userId === currentUser.uid || r.userEmail === currentUser.email)) return true;
    
    // Check if this report was submitted from this client session
    try {
      const stored = localStorage.getItem('eco_user_submitted_reports');
      if (stored) {
        const localList: PollutionReport[] = JSON.parse(stored);
        if (localList.some((lr) => lr.reportId === r.reportId || lr.id === r.id)) return true;
      }
    } catch {
      // ignore
    }

    // Include baseline demo reports for testing
    return r.userId === 'user-eval-002' || r.userId === 'guest-citizen-01' || r.userId === 'admin-viddesh-001';
  });

  const completedChallengeObjects = challenges.filter((c) =>
    completedChallengeIds.includes(c.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'report') setReportPrefillData(null);
          setCurrentTab(tab);
        }}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            openAuthModal={() => setIsAuthModalOpen(true)}
            reports={reports}
            events={communityEvents}
          />
        )}

        {currentTab === 'explore' && <ExplorePage articles={articles} />}

        {/* Dedicated AI Waste Identifier Page */}
        {currentTab === 'ai-identifier' && (
          <AIWasteIdentifierPage
            onReportWaste={handleReportWasteFromAI}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'waste-guide' && <WasteGuidePage />}

        {currentTab === 'challenges' && (
          <EcoChallengesPage
            challenges={challenges}
            completedChallengeIds={completedChallengeIds}
            onChallengeCompleted={handleChallengeCompleted}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'report' && (
          <ReportPollutionPage
            onReportSubmitted={handleReportSubmitted}
            userReports={userReports}
            openAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateTab={setCurrentTab}
            prefillData={reportPrefillData}
          />
        )}

        {currentTab === 'community-reports' && (
          <PollutionReportsDashboard
            reports={reports}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'dashboard' && (
          <UserDashboard
            userReports={userReports}
            completedChallenges={completedChallengeObjects}
            setCurrentTab={setCurrentTab}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            reports={reports}
            challenges={challenges}
            articles={articles}
            onRefreshData={reloadAllData}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Authentication & Instant Demo Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EcoGuardianApp />
    </AuthProvider>
  );
}

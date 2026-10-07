export type PollutionType = 'Air' | 'Water' | 'Plastic/Waste' | 'Noise' | 'Deforestation' | 'Other';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ReportStatus = 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  ecoPoints: number;
  badges: string[];
  reportsCount: number;
  challengesCount: number;
  createdAt: string;
  avatarUrl?: string;
}

export interface PollutionReport {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  pollutionType: PollutionType;
  location: string;
  description: string;
  date: string;
  severity: SeverityLevel;
  imageUrl?: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WasteCategory {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  exampleItems: string[];
  disposalMethod: string;
  recyclingInfo: string;
  environmentalImpact: string;
  dos: string[];
  donts: string[];
  binColor: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: string;
  disposalMethod: string;
  environmentalImpact: string;
  tips: string;
  alternative?: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  category: string;
  iconName?: string;
  active: boolean;
  impactMetric?: string;
}

export interface ChallengeCompletion {
  id: string;
  userId: string;
  challengeId: string;
  completedAt: string;
  pointsEarned: number;
  challengeTitle?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  imageUrl: string;
  readTime: string;
  author: string;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time?: string;
  description: string;
  category: string;
  participantsCount: number;
  participants?: string[];
  imageUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  color: string;
}

export interface AIWasteAnalysisResult {
  wasteType: string;
  confidence: number;
  category: string;
  disposalMethod: string;
  environmentalImpact: string;
  ecoAlternative: string;
  recyclable: boolean;
  keyAdvice: string[];
}

import React from 'react';
import {
  Trophy,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  TreePine,
  Droplets,
  Package,
  Wind,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PollutionReport, EcoChallenge, Badge } from '../types';
import { INITIAL_BADGES } from '../data/mockData';

interface UserDashboardProps {
  userReports: PollutionReport[];
  completedChallenges: EcoChallenge[];
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  userReports,
  completedChallenges,
  setCurrentTab,
  openAuthModal,
}) => {
  const { userProfile, isAdmin, loginAsAdmin, adminEmail } = useAuth();

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900">Sign in to Access Your Dashboard</h2>
        <p className="text-stone-600 max-w-md mx-auto text-sm leading-relaxed">
          Track your personal eco impact metrics, review your submitted pollution hazard tickets, and earn badges as you complete sustainable habits.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={openAuthModal}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-sm shadow-md transition-colors cursor-pointer"
          >
            Sign In / Join Platform
          </button>
          <button
            onClick={async () => {
              await loginAsAdmin();
              setCurrentTab('admin');
            }}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-200" />
            <span>Log in as {adminEmail} (Admin Panel)</span>
          </button>
        </div>
      </div>
    );
  }

  const resolvedReports = userReports.filter((r) => r.status === 'Resolved').length;
  const currentPoints = userProfile.ecoPoints || 50;

  // Determine user level based on points
  let currentLevel = 'Eco Beginner';
  let nextLevelPoints = 100;
  let levelProgress = Math.min(100, Math.round((currentPoints / 100) * 100));

  if (currentPoints >= 1000) {
    currentLevel = 'Guardian of Earth';
    nextLevelPoints = 1500;
    levelProgress = 100;
  } else if (currentPoints >= 600) {
    currentLevel = 'Eco Champion';
    nextLevelPoints = 1000;
    levelProgress = Math.min(100, Math.round(((currentPoints - 600) / 400) * 100));
  } else if (currentPoints >= 300) {
    currentLevel = 'Planet Protector';
    nextLevelPoints = 600;
    levelProgress = Math.min(100, Math.round(((currentPoints - 300) / 300) * 100));
  } else if (currentPoints >= 100) {
    currentLevel = 'Green Explorer';
    nextLevelPoints = 300;
    levelProgress = Math.min(100, Math.round(((currentPoints - 100) / 200) * 100));
  }

  // Calculated eco impact metrics
  const co2Saved = Math.round(currentPoints * 0.45);
  const plasticAvoided = Math.round(currentPoints * 0.28);
  const waterConserved = Math.round(currentPoints * 12);
  const treesSupported = (currentPoints / 250).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Level: {currentLevel}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {userProfile.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Thank you for keeping our communities clean and resilient. Here is your real-time environmental action summary.
            </p>
          </div>

          {/* Points Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xl shadow-md">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">
                Total Eco Points
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white block">
                {currentPoints} pts
              </span>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-200 mb-2">
            <span>Current Rank: <strong>{currentLevel}</strong></span>
            <span>Next Rank: <strong>{nextLevelPoints} pts</strong> ({levelProgress}%)</span>
          </div>
          <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Administrator Control Panel Card directly visible in Dashboard */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-md transition-all ${
        isAdmin 
          ? 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white border-amber-500/40' 
          : 'bg-amber-50/90 border-amber-200 text-stone-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                isAdmin ? 'bg-amber-500 text-amber-950' : 'bg-amber-200 text-amber-900'
              }`}>
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className={`text-xs font-black uppercase tracking-wider ${
                isAdmin ? 'text-amber-300' : 'text-amber-800'
              }`}>
                {isAdmin ? 'Administrator Access Authorized' : 'Master Administrator Panel'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-white/20 text-white border border-white/20' : 'bg-amber-200/60 text-amber-900'
              }`}>
                {adminEmail}
              </span>
            </div>

            <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isAdmin ? 'text-white' : 'text-stone-900'}`}>
              {isAdmin ? 'Admin Console & Incident Oversight' : 'Restricted Administrator Suite'}
            </h3>

            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isAdmin ? 'text-amber-100/80' : 'text-stone-600'}`}>
              Full administrative oversight: audit citizen reports, update resolution statuses, delete invalid submissions, manage eco challenges catalogue, publish awareness articles, and review Recharts metrics.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={() => setCurrentTab('admin')}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Open Master Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={async () => {
                  await loginAsAdmin();
                  setCurrentTab('admin');
                }}
                className="px-6 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Log in as {adminEmail}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Eco Points</span>
          <span className="text-3xl font-black text-emerald-800 block">{currentPoints}</span>
          <span className="text-xs text-stone-500 font-medium">Earned across activities</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Reports Submitted</span>
          <span className="text-3xl font-black text-stone-900 block">{userReports.length}</span>
          <span className="text-xs text-stone-500 font-medium">Hazard tickets filed</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Reports Resolved</span>
          <span className="text-3xl font-black text-emerald-600 block">{resolvedReports}</span>
          <span className="text-xs text-stone-500 font-medium">Remediated violations</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Challenges Completed</span>
          <span className="text-3xl font-black text-teal-700 block">{completedChallenges.length}</span>
          <span className="text-xs text-stone-500 font-medium">Verified eco habits</span>
        </div>
      </div>

      {/* Eco Impact Visual Metrics Section */}
      <div className="bg-emerald-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Cumulative Environmental Footprint</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-950">
            Your Tangible Eco Impact
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-0.5">
            Estimated resource conservation generated by your verified reports and completed challenges.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Wind className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-stone-900">{co2Saved} kg</div>
            <p className="text-xs text-stone-500">CO2 Emissions Averted</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-stone-900">{plasticAvoided} items</div>
            <p className="text-xs text-stone-500">Single-Use Plastics Avoided</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-stone-900">{waterConserved} L</div>
            <p className="text-xs text-stone-500">Clean Water Conserved</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-stone-900">{treesSupported} trees</div>
            <p className="text-xs text-stone-500">Tree Canopy Equivalency</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span>Earned Badges & Distinctions</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Unlock prestigious badges by reaching Eco Point milestones.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            {INITIAL_BADGES.filter((b) => currentPoints >= b.pointsRequired).length} / {INITIAL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = currentPoints >= badge.pointsRequired;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-bold text-sm ${
                      isUnlocked
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-extrabold text-stone-900">{badge.name}</h4>
                  <p className="text-[11px] text-stone-500 leading-snug">{badge.description}</p>
                </div>
                <div className="pt-3 border-t border-stone-200/60 mt-3 text-[10px] font-bold">
                  {isUnlocked ? (
                    <span className="text-emerald-700">Unlocked ✓</span>
                  ) : (
                    <span className="text-stone-400">{badge.pointsRequired} pts needed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Reports & Completed Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User's Reports */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Your Reported Hazards</span>
            </h3>
            <button
              onClick={() => setCurrentTab('report')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + File Report
            </button>
          </div>

          {userReports.length === 0 ? (
            <div className="text-center py-10 text-stone-400 space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">No reports submitted yet.</p>
              <button
                onClick={() => setCurrentTab('report')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Report a local problem to earn +25 pts
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {userReports.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-left"
                >
                  <div className="space-y-0.5 max-w-[220px]">
                    <span className="text-[11px] font-extrabold text-stone-800">{r.reportId}</span>
                    <p className="text-xs font-bold text-emerald-950 truncate">{r.location}</p>
                    <p className="text-[11px] text-stone-500">
                      {r.pollutionType} • {r.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Challenges */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Completed Eco Challenges</span>
            </h3>
            <button
              onClick={() => setCurrentTab('challenges')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Browse More
            </button>
          </div>

          {completedChallenges.length === 0 ? (
            <div className="text-center py-10 text-stone-400 space-y-2">
              <Trophy className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">No challenges completed yet.</p>
              <button
                onClick={() => setCurrentTab('challenges')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Start an eco challenge to earn points!
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {completedChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between text-left"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-950">{ch.title}</p>
                    <p className="text-[11px] text-emerald-700">{ch.category} • {ch.duration}</p>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                    +{ch.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

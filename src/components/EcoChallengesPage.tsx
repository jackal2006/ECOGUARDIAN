import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Filter,
  Flame,
  ArrowRight,
  Shield,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EcoChallenge } from '../types';
import { completeEcoChallenge } from '../services/firebaseService';

interface EcoChallengesPageProps {
  challenges: EcoChallenge[];
  completedChallengeIds: string[];
  onChallengeCompleted: (challenge: EcoChallenge) => void;
  openAuthModal: () => void;
}

export const EcoChallengesPage: React.FC<EcoChallengesPageProps> = ({
  challenges,
  completedChallengeIds,
  onChallengeCompleted,
  openAuthModal,
}) => {
  const { userProfile, currentUser, updateUserPointsLocal } = useAuth();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredChallenges = challenges.filter((ch) => {
    if (filterDifficulty === 'All') return true;
    return ch.difficulty === filterDifficulty;
  });

  const handleComplete = async (challenge: EcoChallenge) => {
    if (!currentUser && !userProfile) {
      openAuthModal();
      return;
    }

    if (completedChallengeIds.includes(challenge.id)) {
      return;
    }

    setSubmittingId(challenge.id);
    const userId = currentUser?.uid || userProfile?.uid || 'guest-user';

    try {
      await completeEcoChallenge(userId, challenge);
      updateUserPointsLocal(challenge.points);
      onChallengeCompleted(challenge);

      setToastMessage(`Congratulations! You earned +${challenge.points} Eco Points for "${challenge.title}"!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error(err);
      // Local fallback for guest
      updateUserPointsLocal(challenge.points);
      onChallengeCompleted(challenge);
      setToastMessage(`Challenge marked complete! (+${challenge.points} pts)`);
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSubmittingId(null);
    }
  };

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-900 border-amber-200',
    Hard: 'bg-rose-100 text-rose-900 border-rose-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            Action & Habit Formation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Eco Action Challenges
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Adopt daily sustainable habits, plant trees, save water, and eliminate single-use plastics to earn Eco Points.
          </p>
        </div>

        {/* Current User Status Pill */}
        {userProfile && (
          <div className="self-start md:self-auto bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase">Your Impact Score</p>
              <p className="text-base font-extrabold text-emerald-950">
                {userProfile.ecoPoints} Points • {completedChallengeIds.length} Completed
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterDifficulty === diff
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {diff === 'All' ? 'All Difficulties' : `${diff} Challenges`}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((ch) => {
          const isCompleted = completedChallengeIds.includes(ch.id);
          const isPendingThis = submittingId === ch.id;

          return (
            <div
              key={ch.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-5 ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-stone-200/90 shadow-sm hover:shadow-lg hover:border-emerald-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Points & Difficulty */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                      difficultyColors[ch.difficulty] || 'bg-stone-100'
                    }`}
                  >
                    {ch.difficulty}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    +{ch.points} Pts
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 leading-snug">{ch.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{ch.description}</p>
                </div>

                {/* Duration & Impact Metric */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Duration: {ch.duration}</span>
                  </div>

                  {ch.impactMetric && (
                    <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl text-[11px] font-semibold border border-emerald-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Impact: {ch.impactMetric}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCompleted ? (
                  <button
                    disabled
                    className="w-full py-3 bg-emerald-100 text-emerald-900 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-emerald-300 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Challenge Completed (+{ch.points} pts)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleComplete(ch)}
                    disabled={isPendingThis}
                    className="w-full py-3 bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-800 hover:to-green-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isPendingThis ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging Completion...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Complete Challenge (+{ch.points} Pts)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

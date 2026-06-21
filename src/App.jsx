import React, { useState, useEffect } from 'react';
import {
  Globe, LayoutDashboard, Calculator, Award, BookOpen, Settings,
  Moon, Sun, Plus, X, Check, Flame, Trophy, Menu, Sparkles, AlertCircle, Share2
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import CarbonCalculator from './components/CarbonCalculator';
import ResultsPage from './components/ResultsPage';
import UserDashboard from './components/UserDashboard';
import ChallengesGrid from './components/ChallengesGrid';
import AchievementsGrid from './components/AchievementsGrid';
import EducationalHub from './components/EducationalHub';
import SettingsTab from './components/SettingsTab';
import Confetti from './components/Confetti';
import MilestoneCard from './components/MilestoneCard';

import { getStorageData, saveStorageData, initializeDefaultData } from './utils/storage';
import { calculateEmissions, generateInsights } from './utils/engine';

export default function App() {
  // App initialization
  useEffect(() => {
    initializeDefaultData();
    // Default-dark mode theme validation
    const savedProfile = getStorageData('user_profile');
    if (!savedProfile || savedProfile?.preferences?.theme !== 'light') {
      document.body.classList.add('dark');
    }
  }, []);

  // View tabs: 'landing' | 'calculator' | 'results' | 'dashboard' | 'challenges' | 'achievements' | 'education' | 'settings'
  const [activeTab, setActiveTab] = useState('landing');

  // Confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // State managed from LocalStorage
  const [profile, setProfile] = useState(() => getStorageData('user_profile'));
  const [carbonScore, setCarbonScore] = useState(() => getStorageData('carbon_score'));
  const [logs, setLogs] = useState(() => getStorageData('action_logs') || []);
  const [goals, setGoals] = useState(() => getStorageData('user_goals') || []);
  const [challenges, setChallenges] = useState(() => getStorageData('active_challenges') || []);
  const [achievements, setAchievements] = useState(() => getStorageData('achievements') || []);
  const [streak, setStreak] = useState(() => getStorageData('streak_data') || { currentStreak: 0, longestStreak: 0 });

  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Share achievement modal
  const [activeShareMilestone, setActiveShareMilestone] = useState(null);

  // FAB / Quick Check Modal state
  const [quickCheckOpen, setQuickCheckOpen] = useState(false);
  const [quickForm, setQuickForm] = useState({
    milesToday: 10,
    transitToday: false,
    dietToday: 'mixed'
  });
  const [quickCheckSuccess, setQuickCheckSuccess] = useState(false);
  const [quickCheckStreak, setQuickCheckStreak] = useState(null);

  // ==================== STATE HELPERS ====================

  const handleCalculate = (answers) => {
    const calculated = calculateEmissions(answers);
    const insights = generateInsights(answers, calculated);

    const nextScore = {
      scoreId: `score_${Date.now()}`,
      calculationDate: new Date().toISOString(),
      answers,
      results: calculated,
      breakdown: calculated.breakdown,
      comparison: calculated.comparison,
      insights
    };

    saveStorageData('carbon_score', nextScore);
    setCarbonScore(nextScore);
    setActiveTab('results');
    triggerConfetti();

    // Unlock Green Beginner badge if not already unlocked
    const hasBeginner = achievements.some(a => a.badgeId === 'green_beginner');
    if (!hasBeginner) {
      handleUnlockBadge({
        badgeId: 'green_beginner',
        name: 'Green Beginner',
        icon: '🌱',
        description: 'Completed your first carbon assessment',
        tier: 'NOVICE',
        rarity: 'Common'
      });
    }
  };

  const handleAddLog = (newAction) => {
    const nextLogs = [newAction, ...logs].slice(0, 100);
    saveStorageData('action_logs', nextLogs);
    setLogs(nextLogs);

    // Milestones check on first logged action
    const hasFirstAction = achievements.some(a => a.badgeId === 'first_action');
    if (!hasFirstAction) {
      handleUnlockBadge({
        badgeId: 'first_action',
        name: 'First Micro-habit Logged',
        icon: '✨',
        description: 'Began carbon logging on Carbonlytics',
        tier: 'NOVICE',
        rarity: 'Common'
      });
    }
  };

  const handleDeleteLog = (id) => {
    const nextLogs = logs.filter(l => l.actionId !== id);
    saveStorageData('action_logs', nextLogs);
    setLogs(nextLogs);
  };

  const handleAddGoal = (newGoal) => {
    const nextGoals = [newGoal, ...goals];
    saveStorageData('user_goals', nextGoals);
    setGoals(nextGoals);
  };

  const handleDeleteGoal = (id) => {
    const nextGoals = goals.filter(g => g.goalId !== id);
    saveStorageData('user_goals', nextGoals);
    setGoals(nextGoals);
  };

  const handleLogChallengeProgress = (id, newProgress, tasks = null) => {
    const nextChallenges = challenges.map((c) => {
      if (c.challengeId === id) {
        return {
          ...c,
          currentProgress: newProgress,
          ...(tasks && { tasks })
        };
      }
      return c;
    });

    saveStorageData('active_challenges', nextChallenges);
    setChallenges(nextChallenges);
  };

  const handleUnlockBadge = (badge) => {
    const hasBadge = achievements.some(a => a.badgeId === badge.badgeId);
    if (hasBadge) return;

    const newUnlock = {
      ...badge,
      unlockedDate: new Date().toISOString()
    };
    const nextAchievements = [newUnlock, ...achievements];
    saveStorageData('achievements', nextAchievements);
    setAchievements(nextAchievements);

    // Automatically trigger share overlay for milestones
    setActiveShareMilestone(newUnlock);
    triggerConfetti();
  };

  const handleUpdateStreak = () => {
    const todayStr = new Date().toDateString();
    const lastActionStr = streak.lastEcoAction ? new Date(streak.lastEcoAction).toDateString() : '';

    let nextStreak = streak.currentStreak;
    if (todayStr !== lastActionStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastActionStr === yesterdayStr || lastActionStr === '') {
        nextStreak += 1;
      } else {
        nextStreak = 1;
      }

      const nextStreakData = {
        currentStreak: nextStreak,
        longestStreak: Math.max(nextStreak, streak.longestStreak),
        lastEcoAction: new Date().toISOString(),
        streakStartDate: lastActionStr === '' ? new Date().toISOString() : streak.streakStartDate
      };

      saveStorageData('streak_data', nextStreakData);
      setStreak(nextStreakData);

      if (nextStreak >= 7) {
        handleUnlockBadge({
          badgeId: 'perfect_week',
          name: 'Perfect Week',
          icon: '🔥',
          description: 'Logged eco actions for 7 consecutive days',
          tier: 'EXPERT',
          rarity: 'Legendary'
        });
      }

      return nextStreakData;
    }
    return streak;
  };

  const handleSaveProfile = (nextProfile) => {
    saveStorageData('user_profile', nextProfile);
    setProfile(nextProfile);
  };

  const handleToggleTheme = () => {
    const current = profile?.preferences?.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    const nextProfile = {
      ...profile,
      preferences: {
        ...profile?.preferences,
        theme: next
      }
    };
    saveStorageData('user_profile', nextProfile);
    setProfile(nextProfile);
    if (next === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  };

  const handleResetData = () => {
    initializeDefaultData(true);
    setProfile(getStorageData('user_profile'));
    setCarbonScore(getStorageData('carbon_score'));
    setLogs(getStorageData('action_logs'));
    setGoals(getStorageData('user_goals'));
    setChallenges(getStorageData('active_challenges'));
    setAchievements(getStorageData('achievements'));
    setStreak(getStorageData('streak_data'));
    setActiveTab('landing');
  };

  const handleQuickCheckSubmit = (e) => {
    e.preventDefault();

    const carCO2 = quickForm.milesToday * 0.404;
    const transitCO2 = quickForm.transitToday ? 0.5 : 0;
    const dietFactors = { vegan: 1.5, vegetarian: 2.0, mixed: 2.8, meatHeavy: 3.5 };
    const dietCO2 = dietFactors[quickForm.dietToday] ?? 2.8;
    const totalDailyCO2 = carCO2 + transitCO2 + dietCO2;
    const savings = Math.max(0.5, 20.2 - totalDailyCO2);

    handleAddLog({
      actionId: `quick_${Date.now()}`,
      type: 'transport',
      title: 'Quick Carbon Checkin',
      description: `Logged travel & food checkin. Emitted ${totalDailyCO2.toFixed(1)} kg CO₂.`,
      date: new Date().toISOString(),
      impact: { co2Saved: savings }
    });

    const updated = handleUpdateStreak();
    setQuickCheckStreak(updated?.currentStreak ?? streak.currentStreak);
    setQuickCheckSuccess(true);
    triggerConfetti();

    setTimeout(() => {
      setQuickCheckSuccess(false);
      setQuickCheckOpen(false);
      setQuickForm({ milesToday: 10, transitToday: false, dietToday: 'mixed' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E2E8F0] flex flex-col pb-16 md:pb-0">
      {showConfetti && <Confetti />}

      <header className="sticky top-0 z-40 bg-[#1A1F2E]/90 backdrop-blur-md border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setActiveTab('landing')} className="flex items-center gap-2 text-white font-black text-xl font-display select-none">
            <Globe className="w-6 h-6 text-[#00D9FF] animate-[spin_20s_linear_infinite]" />
            <span>Carbon<span className="text-[#00D9FF]">lytics</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'landing', label: 'Home', icon: Globe },
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'calculator', label: 'Calculator', icon: Calculator },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'education', label: 'Education', icon: BookOpen },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === 'calculator' && activeTab === 'results');

              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isActive ? 'bg-cyan-950/40 text-[#00D9FF] border border-cyan-800/30' : 'text-stone-400 hover:bg-zinc-800/40 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-stone-300 hover:bg-zinc-800/60 hover:text-white"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#0F1419] py-3 px-4 flex flex-col gap-1.5 text-left">
            {[
              { id: 'landing', label: 'Home', icon: Globe },
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'calculator', label: 'Calculator', icon: Calculator },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'education', label: 'Education', icon: BookOpen },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === 'calculator' && activeTab === 'results');

              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${isActive ? 'bg-cyan-950/40 text-[#00D9FF] border border-cyan-800/30' : 'text-stone-400 hover:bg-zinc-800/40 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartCalculator={() => setActiveTab('calculator')}
            onExploreDemo={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'calculator' && (
          <CarbonCalculator
            onCalculate={handleCalculate}
            initialAnswers={carbonScore?.answers}
          />
        )}

        {activeTab === 'results' && carbonScore && (
          <ResultsPage
            carbonScore={carbonScore}
            onSaveAction={handleAddLog}
            onNavigateToDashboard={(targetTab) => setActiveTab(targetTab)}
          />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard
            profile={profile}
            carbonScore={carbonScore}
            streak={streak}
            logs={logs}
            goals={goals}
            challenges={challenges}
            achievements={achievements}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onUpdateStreak={handleUpdateStreak}
            onNavigateToTab={(targetTab) => setActiveTab(targetTab)}
          />
        )}

        {activeTab === 'challenges' && (
          <ChallengesGrid
            challenges={challenges}
            onLogProgress={handleLogChallengeProgress}
            onTriggerConfetti={triggerConfetti}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsGrid achievements={achievements} />
        )}

        {activeTab === 'education' && <EducationalHub />}

        {activeTab === 'settings' && (
          <SettingsTab
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onResetData={handleResetData}
          />
        )}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1F2E]/95 border-t border-zinc-800/80 h-16 flex items-center justify-around px-2 backdrop-blur-md">
        {[
          { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
          { id: 'calculator', label: 'Calc', icon: Calculator },
          { id: 'challenges', label: 'Chall', icon: Trophy },
          { id: 'achievements', label: 'Awards', icon: Award },
          { id: 'settings', label: 'Profile', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-xl transition-all ${isActive ? 'text-[#00D9FF] font-bold' : 'text-stone-500'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
        <button
          onClick={() => setQuickCheckOpen(true)}
          className="w-14 h-14 bg-[#00D9FF] hover:bg-[#33E1FF] text-zinc-950 rounded-full flex items-center justify-center shadow-heavy hover:scale-105 active:scale-95 transition-all duration-200"
          title="Quick Carbon Check"
        >
          <Plus className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {quickCheckOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1F2E] border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-heavy text-left relative animate-scale-up space-y-6">
            <button
              onClick={() => setQuickCheckOpen(false)}
              disabled={quickCheckSuccess}
              className="absolute top-4 right-4 p-1 hover:bg-zinc-800 text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!quickCheckSuccess ? (
              <>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-[#00D9FF]" />
                    Quick Carbon Check
                  </h3>
                  <p className="text-xs text-stone-400">Log footprint parameters in 5 seconds.</p>
                </div>

                <form onSubmit={handleQuickCheckSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-300">Miles driven today?</span>
                      <span className="font-extrabold text-[#00D9FF]">{quickForm.milesToday} miles</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={quickForm.milesToday}
                      onChange={(e) => setQuickForm((prev) => ({ ...prev, milesToday: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#0F1419] border border-zinc-800 rounded-xl">
                    <span className="text-xs font-bold text-stone-300">Used transit/bus today?</span>
                    <button
                      type="button"
                      onClick={() => setQuickForm((prev) => ({ ...prev, transitToday: !prev.transitToday }))}
                      className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${quickForm.transitToday ? 'bg-[#00D9FF]' : 'bg-zinc-800'}`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${quickForm.transitToday ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-300">Diet choices today?</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: 'vegan', label: '🌱 Vegan' },
                        { val: 'vegetarian', label: '🥬 Vegetarian' },
                        { val: 'mixed', label: '🍗 Mixed' },
                        { val: 'meatHeavy', label: '🥩 Heavy Meat' }
                      ].map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => setQuickForm((prev) => ({ ...prev, dietToday: d.val }))}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${quickForm.dietToday === d.val ? 'border-[#00D9FF] bg-cyan-950/20 text-[#00D9FF]' : 'border-zinc-800 bg-transparent text-stone-400 hover:border-zinc-700'}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#00D9FF] hover:bg-[#33E1FF] text-[#0F1419] rounded-xl text-xs font-bold transition-all shadow-subtle flex items-center justify-center gap-1"
                  >
                    <span>Record Entry</span>
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 bg-[#1A1F2E] border border-cyan-400 text-cyan-400 rounded-full flex items-center justify-center shadow-medium">
                  <Check className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Checkin Recorded!</h3>
                  <p className="text-xs text-[#00D9FF] font-bold">Streak maintained: {quickCheckStreak} Days 🔥</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeShareMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1A1F2E] border border-[rgba(0,217,255,0.3)] rounded-3xl p-6 w-full max-w-sm shadow-heavy text-center relative animate-scale-up space-y-6">
            <button
              onClick={() => setActiveShareMilestone(null)}
              className="absolute top-4 right-4 p-1 hover:bg-zinc-800 text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-850 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Shareable Achievement Card
              </span>
              <h3 className="text-xl font-extrabold text-white">Milestone Unlocked!</h3>
            </div>

            <div className="p-6 bg-[#0F1419] border border-zinc-800 rounded-2xl flex flex-col items-center space-y-4">
              <span className="text-6xl">{activeShareMilestone.icon}</span>
              <div>
                <h4 className="text-base font-extrabold text-white">{activeShareMilestone.name}</h4>
                <p className="text-xs text-stone-400 mt-1">{activeShareMilestone.description}</p>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider">
                CARBONLYTICS COMMUNITY
              </div>
            </div>

            <button
              onClick={() => {
                alert('Achievement card link copied to clipboard (Simulated)!');
                setActiveShareMilestone(null);
              }}
              className="w-full py-3 bg-[#00D9FF] hover:bg-[#33E1FF] text-zinc-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-subtle"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Share Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

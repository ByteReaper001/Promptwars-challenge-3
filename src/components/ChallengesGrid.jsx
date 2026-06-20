import React, { useState } from 'react';
import { 
  Flame, Award, Footprints, Utensils, Trash2, Bus, Zap, Check, 
  ChevronRight, Calendar, User, Trophy, Play, CheckCircle, Info 
} from 'lucide-react';

export default function ChallengesGrid({ challenges, onLogProgress, onTriggerConfetti, onUnlockBadge }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Leaderboard mock data for Step challenge
  const stepsLeaderboard = [
    { rank: 1, name: 'Sarah Jenkins', steps: '315,000 steps', avatar: '👩‍🌾' },
    { rank: 2, name: 'You (Explorer)', steps: '245,000 steps', avatar: '🧑‍💻', current: true },
    { rank: 3, name: 'Mike Alvarez', steps: '198,000 steps', avatar: '👨‍🚀' }
  ];

  const handleActionClick = (challenge) => {
    let completed = false;
    let newProgress = challenge.currentProgress + 1;
    let badgeToUnlock = null;

    if (challenge.challengeId === 'steps_daily') {
      if (newProgress >= challenge.targetProgress) {
        newProgress = challenge.targetProgress;
        completed = true;
        badgeToUnlock = {
          badgeId: 'step_master',
          name: 'Step Master',
          icon: '🚶',
          description: 'Completed the 30-day 10,000 steps daily eco-challenge',
          tier: 'INTERMEDIATE',
          rarity: 'Rare'
        };
      }
    } else if (challenge.challengeId === 'meat_free_mondays') {
      if (newProgress >= challenge.targetProgress) {
        newProgress = challenge.targetProgress;
        completed = true;
        badgeToUnlock = {
          badgeId: 'veg_enthusiast',
          name: 'Vegetarian Enthusiast',
          icon: '🥗',
          description: 'Completed 12 weeks of Meatless Mondays',
          tier: 'INTERMEDIATE',
          rarity: 'Rare'
        };
      }
    } else if (challenge.challengeId === 'plastic_free') {
      if (newProgress >= challenge.targetProgress) {
        newProgress = challenge.targetProgress;
        completed = true;
        badgeToUnlock = {
          badgeId: 'plastic_warrior',
          name: 'Plastic Warrior',
          icon: '🛡️',
          description: 'Finished 7 days of plastic-free lifestyle checkins',
          tier: 'EXPERT',
          rarity: 'Epic'
        };
      }
    } else if (challenge.challengeId === 'transit_commute') {
      if (newProgress >= challenge.targetProgress) {
        newProgress = challenge.targetProgress;
        completed = true;
        badgeToUnlock = {
          badgeId: 'transit_champion',
          name: 'Green Commuter',
          icon: '🚌',
          description: 'Logged 20 public transit checkins',
          tier: 'EXPERT',
          rarity: 'Epic'
        };
      }
    }

    onLogProgress(challenge.challengeId, newProgress);

    if (completed) {
      onTriggerConfetti();
      if (badgeToUnlock) {
        onUnlockBadge(badgeToUnlock);
      }
    }
  };

  // Toggle tasks on subchecklist for Energy quest
  const handleTaskToggle = (taskIndex, challenge) => {
    const updatedTasks = challenge.tasks.map((t, idx) => {
      if (idx === taskIndex) return { ...t, done: !t.done };
      return t;
    });
    
    // Calculate new progress based on total XP of finished tasks
    const completedXP = updatedTasks.reduce((sum, t) => sum + (t.done ? t.xp : 0), 0);
    onLogProgress(challenge.challengeId, completedXP, updatedTasks);

    if (completedXP >= challenge.targetProgress) {
      onTriggerConfetti();
      onUnlockBadge({
        badgeId: 'energy_saver',
        name: 'Energy Saver',
        icon: '☀️',
        description: 'Successfully completed all tasks in the Energy Efficiency Quest',
        tier: 'EXPERT',
        rarity: 'Epic'
      });
    }
  };

  // Mapping challenge IDs to appropriate icons
  const challengeIcons = {
    steps_daily: Footprints,
    meat_free_mondays: Utensils,
    plastic_free: Trash2,
    transit_commute: Bus,
    energy_efficiency: Zap
  };

  return (
    <div className="animate-fade-in py-8 px-4 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
          🎯 Gamified Challenges
        </h2>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Complete daily or weekly challenges, earn XP rewards, unlock badges, and trace climate improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CHALLENGES CARDS (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {challenges.map((c) => {
            const Icon = challengeIcons[c.challengeId] || Trophy;
            const progressPct = Math.round((c.currentProgress / c.targetProgress) * 100);
            const isCompleted = c.currentProgress >= c.targetProgress;
            
            return (
              <div 
                key={c.challengeId}
                onClick={() => setSelectedChallenge(c)}
                className={`p-6 bg-white dark:bg-zinc-900 border rounded-3xl shadow-subtle hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200 text-left flex flex-col justify-between min-h-[200px] cursor-pointer ${
                  selectedChallenge?.challengeId === c.challengeId 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                    : 'border-stone-150 dark:border-zinc-850'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 dark:bg-zinc-800 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-zinc-750">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-900 dark:text-white text-base flex items-center gap-1.5">
                          {c.name}
                          {isCompleted && (
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                              Completed ✓
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-stone-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
                          Difficulty: {c.difficulty} | Reward: {c.rewardXP} XP
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(c);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-100 disabled:text-stone-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-650 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-subtle transition-all duration-150"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{c.challengeId === 'energy_efficiency' ? 'Inspect checklist' : 'Log Activity'}</span>
                    </button>
                  </div>

                  {/* Progress slide */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-stone-500">
                      <span>PROGRESS</span>
                      <span>
                        {c.currentProgress} / {c.targetProgress} {c.challengeId === 'energy_efficiency' ? 'XP' : 'Days'} ({progressPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-stone-400 font-semibold mt-4 border-t border-stone-50 dark:border-zinc-850 pt-3">
                  <span>Category: {c.category}</span>
                  <span className="text-emerald-600 hover:underline flex items-center gap-0.5">
                    View Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SIDE DETAIL PANEL (Col span 5) */}
        <div className="lg:col-span-5">
          {selectedChallenge ? (
            <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-3xl shadow-medium space-y-6 animate-scale-up">
              <div className="space-y-1 border-b border-stone-100 dark:border-zinc-800 pb-4">
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">{selectedChallenge.name}</h3>
                <p className="text-xs text-stone-400 dark:text-zinc-550">Specific metrics and community standings</p>
              </div>

              {/* A. Walk Challenge Detail with leaderboard */}
              {selectedChallenge.challengeId === 'steps_daily' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">Weekly steps standings</h4>
                    <div className="border border-stone-100 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-zinc-800">
                      {stepsLeaderboard.map((user) => (
                        <div 
                          key={user.rank}
                          className={`p-3 text-xs flex justify-between items-center ${
                            user.current ? 'bg-emerald-50/20 dark:bg-emerald-950/20 font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold w-4">{user.rank}.</span>
                            <span className="text-base">{user.avatar}</span>
                            <span className="text-stone-850 dark:text-zinc-200">{user.name}</span>
                          </div>
                          <span className="font-semibold text-stone-500 dark:text-zinc-400">{user.steps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-850 rounded-2xl text-xs leading-relaxed text-stone-600 dark:text-zinc-400">
                    💡 <span className="font-bold text-stone-800 dark:text-zinc-350">Eco-Tip:</span> Walking instead of driving just 3 miles daily saves approximately 1.2 kg CO₂ and helps reduce urban congestion.
                  </div>
                </div>
              )}

              {/* B. Energy Quest Checklist */}
              {selectedChallenge.challengeId === 'energy_efficiency' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">Action Checklist</h4>
                  
                  <div className="space-y-2">
                    {selectedChallenge.tasks.map((task, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleTaskToggle(idx, selectedChallenge)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-150 ${
                          task.done 
                            ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10' 
                            : 'border-stone-150 dark:border-zinc-850 hover:border-stone-250 dark:hover:border-zinc-750'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            task.done 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'border-stone-300 dark:border-zinc-700'
                          }`}>
                            {task.done && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-xs ${task.done ? 'line-through text-stone-400' : 'text-stone-850 dark:text-zinc-200'}`}>
                            {task.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-450">+{task.xp} XP</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-stone-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-stone-100 dark:border-zinc-850 text-xs">
                    <div>
                      <div className="text-stone-400 text-[10px]">Monthly Savings</div>
                      <div className="font-extrabold text-emerald-600 dark:text-emerald-450">~$45.00</div>
                    </div>
                    <div>
                      <div className="text-stone-400 text-[10px]">Annual Impact</div>
                      <div className="font-extrabold text-stone-800 dark:text-zinc-350">-580 kg CO₂</div>
                    </div>
                  </div>
                </div>
              )}

              {/* C. Default placeholder details */}
              {selectedChallenge.challengeId !== 'steps_daily' && selectedChallenge.challengeId !== 'energy_efficiency' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">Challenge Milestones</h4>
                  
                  <div className="space-y-2">
                    {[
                      { label: 'Start Challenge & Log first day', met: true },
                      { label: 'Maintain a 5-day checkin streak', met: selectedChallenge.currentProgress >= 5 },
                      { label: 'Reach 75% target threshold', met: selectedChallenge.currentProgress >= selectedChallenge.targetProgress * 0.75 },
                      { label: 'Final Completion & Reward Unlock', met: selectedChallenge.currentProgress >= selectedChallenge.targetProgress }
                    ].map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-600 dark:text-zinc-400">
                        {m.met ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-450 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-stone-300 dark:border-zinc-700 flex-shrink-0" />
                        )}
                        <span className={m.met ? 'font-semibold text-stone-800 dark:text-zinc-200' : ''}>{m.label}</span>
                      </div>
                    ))}
                  </div>

                  {selectedChallenge.expectedImpact && (
                    <div className="p-3.5 bg-emerald-50/25 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                      🌿 <span className="font-bold text-emerald-800 dark:text-emerald-350">Expected carbon reduction:</span> Completing this challenge reduces your annual emission output by approximately <span className="font-bold">~{selectedChallenge.expectedImpact} kg CO₂</span>.
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-stone-200 dark:border-zinc-850 rounded-3xl text-center text-stone-400 dark:text-zinc-650 min-h-[300px] flex flex-col justify-center items-center gap-2">
              <Info className="w-8 h-8" />
              <div className="text-sm font-bold">Select a Challenge</div>
              <div className="text-xs">Click on any challenge card on the left to see stats and standalone tasks.</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

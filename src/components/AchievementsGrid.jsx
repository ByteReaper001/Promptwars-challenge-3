import React, { useState } from 'react';
import { Award, Lock, Sparkles, X, Calendar, Globe, Bookmark } from 'lucide-react';

export default function AchievementsGrid({ achievements }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Standard list of 20+ badges
  const allBadges = [
    // Tier 1: NOVICE
    { id: 'green_beginner', name: 'Green Beginner', icon: '🌱', desc: 'Completed first carbon assessment calculations.', tier: 'NOVICE', rarity: 'Common', condition: 'Take the initial carbon footprint calculator' },
    { id: 'recycling_champ', name: 'Recycling Champion', icon: '♻️', desc: 'Recycled plastics, glass, paper regularly.', tier: 'NOVICE', rarity: 'Common', condition: 'Choose recycling regularly or always' },
    { id: 'water_saver', name: 'Water Saver', icon: '💧', desc: 'Utilized solar/heatpump heating options.', tier: 'NOVICE', rarity: 'Common', condition: 'Select solar or heatpump water heating' },
    { id: 'appliance_inspector', name: 'Appliance Inspector', icon: '🔌', desc: 'Low overall home electric appliance counts.', tier: 'NOVICE', rarity: 'Common', condition: 'Keep appliance count under 10 items' },
    { id: 'plant_based_first', name: 'Plant-Based First', icon: '🥬', desc: 'Tested vegan/vegetarian diet routines.', tier: 'NOVICE', rarity: 'Common', condition: 'Select vegetarian or vegan diet type' },
    { id: 'eco_passenger', name: 'Eco Passenger', icon: '🚌', desc: 'Commuted via train/bus public transit.', tier: 'NOVICE', rarity: 'Common', condition: 'Select occasionally or regularly transit' },
    { id: 'eco_shopper', name: 'Eco Shopper', icon: '🛍️', desc: 'Minimal monthly online shopping habits.', tier: 'NOVICE', rarity: 'Common', condition: 'Keep online purchases under 4 monthly' },
    
    // Tier 2: INTERMEDIATE
    { id: 'commuter', name: 'Sustainable Commuter', icon: '🚲', desc: 'Biked 50km in a month instead of driving.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Biked instead of driving and saved 50kg CO2' },
    { id: 'step_master', name: 'Step Master', icon: '🚶', desc: 'Walked 10,000 steps daily for a month.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Finish 30 days of the 10,000 steps daily challenge' },
    { id: 'veg_enthusiast', name: 'Vegetarian Enthusiast', icon: '🥗', desc: 'Successfully logged 12 weeks of Meatless Mondays.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Complete 12 weeks of Meatless Monday checkins' },
    { id: 'led_visionary', name: 'LED Visionary', icon: '💡', desc: 'Upgraded household light bulbs to LED.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Log switching to LED light bulbs' },
    { id: 'smart_heater', name: 'Smart Heater', icon: '🌡️', desc: 'Utilized programmable smart thermostats.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Install dynamic smart home thermostat' },
    { id: 'recycle_routine', name: 'Recycle Routine', icon: '🗑️', desc: 'Maintained zero-waste landfill practices.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Always recycle in waste management' },
    { id: 'fast_fashion_slasher', name: 'Fashion Slasher', icon: '👕', desc: 'Reduced textile manufacturing impact.', tier: 'INTERMEDIATE', rarity: 'Rare', condition: 'Keep fast fashion purchases to 0 items' },
    
    // Tier 3: EXPERT
    { id: 'solar_advocate', name: 'Solar Advocate', icon: '☀️', desc: 'Solarized roof for clean power generation.', tier: 'EXPERT', rarity: 'Epic', condition: 'Toggle Solar Panel Installation in simulator or settings' },
    { id: 'ev_pioneer', name: 'EV Pioneer', icon: '🚗', desc: 'Replaced traditional engines with Electric vehicles.', tier: 'EXPERT', rarity: 'Epic', condition: 'Toggle Switch to Electric Vehicle in simulator' },
    { id: 'carbon_neutral', name: 'Carbon Neutral', icon: '🌍', desc: 'Attained a net 0 annual carbon score.', tier: 'EXPERT', rarity: 'Legendary', condition: 'Attain carbon score of 2.0 Tons or lower' },
    { id: 'plastic_warrior', name: 'Plastic Warrior', icon: '🛡️', desc: 'Completed 7 days of single-use plastic avoidance.', tier: 'EXPERT', rarity: 'Epic', condition: 'Complete the Plastic-Free Week challenge' },
    { id: 'transit_champion', name: 'Transit Champion', icon: '🚇', desc: 'Logged 20 public transit checkin sessions.', tier: 'EXPERT', rarity: 'Epic', condition: 'Complete the Public Transport Focus challenge' },
    { id: 'energy_saver', name: 'Energy Saver', icon: '⚡', desc: 'Completed all subtasks in Energy efficiency quest.', tier: 'EXPERT', rarity: 'Epic', condition: 'Finish Energy Efficiency Quest challenge list' },
    { id: 'perfect_week', name: 'Perfect Week', icon: '🔥', desc: 'Logged eco actions 7 consecutive days.', tier: 'EXPERT', rarity: 'Legendary', condition: 'Advance action streak past 7 days' }
  ];

  // Organize by Tiers
  const tiers = {
    NOVICE: allBadges.filter(b => b.tier === 'NOVICE'),
    INTERMEDIATE: allBadges.filter(b => b.tier === 'INTERMEDIATE'),
    EXPERT: allBadges.filter(b => b.tier === 'EXPERT')
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'bg-stone-100 text-stone-700 dark:bg-zinc-800 dark:text-zinc-300',
      'Rare': 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400',
      'Epic': 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400',
      'Legendary': 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse'
    };
    return colors[rarity] ?? 'bg-stone-100 text-stone-700';
  };

  return (
    <div className="animate-fade-in py-8 px-4 max-w-7xl mx-auto space-y-12 text-left">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
          🏆 Achievements & Badges
        </h2>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Trace your eco accomplishments. Unlocked badges display in vibrant colors, while locked badges remain grayed out.
        </p>
      </div>

      {/* RENDER BY TIERS */}
      {Object.entries(tiers).map(([tierName, badges]) => (
        <div key={tierName} className="space-y-6">
          <div className="border-b border-stone-100 dark:border-zinc-850 pb-2 flex items-center gap-2">
            <h3 className="text-lg font-black tracking-wide text-stone-850 dark:text-zinc-200">
              {tierName} BADGES
            </h3>
            <span className="text-[10px] bg-stone-100 dark:bg-zinc-800 text-stone-500 px-2.5 py-0.5 rounded-full font-bold">
              {badges.filter(b => achievements.some(a => a.badgeId === b.id)).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {badges.map((badge) => {
              const unlockedRecord = achievements.find(a => a.badgeId === badge.id);
              const isUnlocked = !!unlockedRecord;

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge({ ...badge, unlockedRecord })}
                  className={`p-4 rounded-2xl bg-white dark:bg-zinc-900 border text-center flex flex-col justify-between items-center gap-3 cursor-pointer select-none transition-all duration-300 hover:scale-102 hover:shadow-medium ${
                    isUnlocked
                      ? 'border-emerald-500/70 shadow-subtle'
                      : 'border-stone-150 dark:border-zinc-850 opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="text-4xl filter drop-shadow-md select-none">{badge.icon}</span>
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-stone-900/10 rounded-full flex items-center justify-center text-stone-500 dark:text-zinc-400">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold text-stone-900 dark:text-white leading-tight">
                      {badge.name}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* BADGE DETAILS MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-heavy text-center relative animate-scale-up space-y-6">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 hover:text-stone-850 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pt-4 flex flex-col items-center">
              <span className="text-6xl filter drop-shadow-lg">{selectedBadge.icon}</span>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-stone-900 dark:text-white">{selectedBadge.name}</h3>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getRarityColor(selectedBadge.rarity)}`}>
                  {selectedBadge.rarity} Rarity
                </span>
              </div>
            </div>

            <hr className="border-stone-100 dark:border-zinc-800" />

            <div className="text-xs text-stone-600 dark:text-zinc-400 space-y-3.5 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wide">Description</span>
                <p className="leading-relaxed font-semibold">{selectedBadge.desc}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wide">How to Unlock</span>
                <p className="leading-relaxed">{selectedBadge.condition}</p>
              </div>
              
              {selectedBadge.unlockedRecord ? (
                <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl flex justify-between items-center text-emerald-800 dark:text-emerald-300 font-bold">
                  <span className="flex items-center gap-1">✓ Unlocked</span>
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500">
                    {new Date(selectedBadge.unlockedRecord.unlockedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl flex justify-between items-center text-stone-550 dark:text-zinc-450">
                  <span className="flex items-center gap-1">🔒 Locked</span>
                  <span className="text-[10px]">In Progress</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

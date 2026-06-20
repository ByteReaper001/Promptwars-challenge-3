import React, { useState } from 'react';
import { 
  Flame, Leaf, Award, TrendingDown, Clock, Plus, Trash2, 
  Check, Calendar, Activity, ChevronRight, X, Sparkles, LogIn, Dumbbell, Download, RefreshCw
} from 'lucide-react';
import { SVGLineChart, SVGBarChart } from './SVGCharts';
import Waveform from './Waveform';

export default function UserDashboard({ 
  profile, carbonScore, streak, logs, goals, challenges, achievements,
  onAddLog, onDeleteLog, onAddGoal, onDeleteGoal, onUpdateStreak, onNavigateToTab 
}) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  // Weekly challenge selection state
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);

  // Recommendations: weekly rotation AI simulation
  const recommendationsList = [
    { id: 'rec_commute', title: 'Replace 2 car commutes with transit this week', impact: '-2.1 kg CO₂ estimated', co2: 2.1 },
    { id: 'rec_beef', title: 'Skip beef/lamb meals for 3 consecutive days', impact: '-6.0 kg CO₂ estimated', co2: 6.0 },
    { id: 'rec_lights', title: 'Turn off non-active workspace bulbs overnight', impact: '-1.5 kg CO₂ estimated', co2: 1.5 },
    { id: 'rec_temp', title: 'Adjust temperature baseline by 2 degrees', impact: '-3.8 kg CO₂ estimated', co2: 3.8 }
  ];

  // Quick log state matching the 3 categories: Transport | Food | Energy
  const [logForm, setLogForm] = useState({
    category: 'transport',
    activityType: 'car_commute',
    customTitle: '',
    co2Saved: '3.5'
  });

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetScore: '6.0',
    deadlineDays: '30'
  });

  const handleLogSubmit = (e) => {
    e.preventDefault();
    
    // Category mapping presets
    const presets = {
      // Transport
      car_commute: { title: 'Personal Car Commute', co2: -4.5, desc: 'Logged typical car driving sessions' },
      transit_bus: { title: 'Transit Bus Commute', co2: 1.5, desc: 'Logged bus transit instead of personal driving' },
      // Food
      beef_meal: { title: 'Beef/Lamb Meal Output', co2: -3.5, desc: 'Consumed beef protein components' },
      veg_meal: { title: 'Vegetarian Meal Choice', co2: 0.8, desc: 'Opted for low carbon plant proteins' },
      // Energy
      heating_on: { title: 'Heating/Cooling Standard Use', co2: -2.8, desc: 'Logged base temperature control grid draw' },
      led_lights: { title: 'Eco LED Upgrade', co2: 0.5, desc: 'Saved household wattage using LEDs' },
      // Custom
      custom: { title: logForm.customTitle || 'Custom Eco Action', co2: Number(logForm.co2Saved) || 1.0, desc: 'Logged custom lifestyle option' }
    };

    const action = presets[logForm.activityType] || presets['custom'];
    
    // Emissions calculations: positive co2 represents reduction offset (savings), negative represents addition.
    // Daily emissions are updated.
    onAddLog({
      actionId: `act_${Date.now()}`,
      type: logForm.category,
      title: action.title,
      description: action.desc,
      date: new Date().toISOString(),
      impact: { co2Saved: action.co2 }
    });

    setLogForm({ category: 'transport', activityType: 'car_commute', customTitle: '', co2Saved: '3.5' });
    setShowLogModal(false);
    onUpdateStreak();
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalForm.title) return;

    onAddGoal({
      goalId: `goal_${Date.now()}`,
      title: goalForm.title,
      targetScore: Number(goalForm.targetScore) || 6.0,
      currentScore: carbonScore.results.totalTonnes,
      startDate: new Date().toISOString(),
      deadline: new Date(Date.now() + Number(goalForm.deadlineDays) * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
      status: 'in_progress'
    });

    setGoalForm({ title: '', targetScore: '6.0', deadlineDays: '30' });
    setShowGoalModal(false);
  };

  // Convert logs to CSV and prompt download
  const handleExportCSV = () => {
    const headers = ['Action ID', 'Category', 'Title', 'Description', 'Timestamp', 'CO2 Impact (kg)'];
    const rows = logs.map(l => [
      l.actionId,
      l.type || 'eco_action',
      l.title,
      l.description,
      l.date,
      l.impact?.co2Saved ?? 0
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `carbonverse_history_${profile.name || 'user'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate live weekly metric based on logs. Baseline: 180kg CO2/week.
  const loggedOffset = logs
    .filter(log => new Date(log.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
    .reduce((sum, item) => sum + (item.impact?.co2Saved || 0), 0);
  
  // Waveform value: lower is better. Baseline emissions are reduced by loggedOffset.
  const baseEmissionsVal = Math.max(10, 192.5 - loggedOffset);
  
  let waveIntensity = 'cyan';
  if (baseEmissionsVal < 140) waveIntensity = 'green';
  else if (baseEmissionsVal > 220) waveIntensity = 'red';

  // Mock data for charts
  const weeklyActual = [2.4, 2.1, 2.8, 1.7, 2.3, 1.8, (baseEmissionsVal / 100)];
  const weeklyTarget = [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8];

  const monthlyData = [
    { month: 'Jan', monthName: 'January', actual: 7.6, target: 7.0 },
    { month: 'Feb', monthName: 'February', actual: 7.4, target: 6.8 },
    { month: 'Mar', monthName: 'March', actual: 7.2, target: 6.5 },
    { month: 'Apr', monthName: 'April', actual: 7.1, target: 6.2 },
    { month: 'May', monthName: 'May', actual: 6.8, target: 6.0 },
    { month: 'Jun', monthName: 'June', actual: carbonScore.results.totalTonnes, target: 6.0 }
  ];

  return (
    <div className="animate-fade-in py-8 px-4 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display flex items-center gap-2">
            Welcome to CarbonVerse, {profile.name || 'Explorer'}!
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Map emissions into real-time waveforms. Log habits and build progression private-by-default.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#00D9FF] hover:bg-[#33E1FF] text-zinc-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Action</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1A1F2E] hover:bg-zinc-800 text-cyan-400 border border-cyan-800/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* WAVEFORM & CHALLENGE BLOCK */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Living Waveform Visual (Col 7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <Waveform value={baseEmissionsVal} intensity={waveIntensity} />
        </div>
        
        {/* Resonance Recommendation AI Card (Col 5) */}
        <div className="lg:col-span-5 p-6 bg-[#1A1F2E] border border-[rgba(0,217,255,0.15)] rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden shadow-heavy">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#3A5A40]/10 rounded-full blur-xl" />
          
          <div className="space-y-3 z-10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/30 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Resonance Recommendations
              </span>
              <button 
                onClick={() => setSelectedChallengeIdx((prev) => (prev + 1) % recommendationsList.length)}
                className="text-[10px] text-stone-400 hover:text-white flex items-center gap-1"
                title="Rotate recommendation"
              >
                <RefreshCw className="w-3 h-3" /> Skip
              </button>
            </div>
            
            <div className="pt-2">
              <h4 className="text-base font-extrabold text-white">
                {recommendationsList[selectedChallengeIdx].title}
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                We picked ONE active micro-habit challenge for you this week based on highest carbon impact per effort.
              </p>
            </div>
            
            <div className="text-xs font-bold text-cyan-400 font-mono">
              Impact: {recommendationsList[selectedChallengeIdx].impact}
            </div>
          </div>

          <button
            onClick={() => {
              onAddLog({
                actionId: `rec_${Date.now()}`,
                type: 'energy',
                title: 'Accepted Challenge: ' + recommendationsList[selectedChallengeIdx].title.split(' this')[0],
                description: 'Completed weekly recommended carbon mitigation.',
                date: new Date().toISOString(),
                impact: { co2Saved: recommendationsList[selectedChallengeIdx].co2 }
              });
              onUpdateStreak();
            }}
            className="w-full py-3 bg-[#3A5A40] hover:bg-[#4d7054] text-white rounded-xl text-xs font-bold transition-all shadow-subtle z-10"
          >
            Accept Habit Challenge
          </button>
        </div>
      </section>

      {/* SECTION 1: QUICK STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Your Score */}
        <div className="p-5 rounded-2xl bg-[#1A1F2E] border border-zinc-800/70 shadow-subtle flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Current Score</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {carbonScore.results.totalTonnes} <span className="text-xs text-stone-400 font-medium">Tons CO₂</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold mt-2">
            Target: 2.0 Tons
          </span>
        </div>

        {/* Card 2: Improvement */}
        <div className="p-5 rounded-2xl bg-[#1A1F2E] border border-zinc-800/70 shadow-subtle flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Month Change</span>
          <div className="text-2xl sm:text-3xl font-black text-[#3A5A40] mt-1 flex items-center gap-1 font-mono">
            <TrendingDown className="w-6 h-6" />
            <span>-0.3 T</span>
          </div>
          <span className="text-[10px] text-stone-500 font-semibold mt-2">
            -4.1% emissions drop
          </span>
        </div>

        {/* Card 3: Streak */}
        <div className="p-5 rounded-2xl bg-[#1A1F2E] border border-zinc-800/70 shadow-subtle flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Action Streak</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-500 mt-1 flex items-center gap-1 font-mono">
            <Flame className="w-6 h-6 fill-orange-500" />
            <span>{streak.currentStreak} Days</span>
          </div>
          <span className="text-[10px] text-stone-500 font-semibold mt-2">
            Record: {streak.longestStreak} Days
          </span>
        </div>

        {/* Card 4: Total Saved */}
        <div className="p-5 rounded-2xl bg-[#1A1F2E] border border-zinc-800/70 shadow-subtle flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Saved</span>
          <div className="text-2xl sm:text-3xl font-black text-sky-500 mt-1 flex items-center gap-1 font-mono">
            <Leaf className="w-6 h-6" />
            <span>{(loggedOffset / 1000 + 2.1).toFixed(2)} Tons</span>
          </div>
          <span className="text-[10px] text-stone-500 font-semibold mt-2">
            Saved this calendar year
          </span>
        </div>
      </section>

      {/* SECTION 2: CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-white font-display">Weekly Carbon Trend</h3>
          <SVGLineChart actualData={weeklyActual} targetData={weeklyTarget} />
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-white font-display">Monthly Comparison</h3>
          <SVGBarChart data={monthlyData} />
        </div>
      </section>

      {/* SECTION 3: GOALS & CHALLENGES PREVIEWS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Goals List (Col span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white font-display">Reduction Goals</h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-xs text-cyan-400 hover:text-[#33E1FF] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => (
              <div 
                key={g.goalId} 
                className="p-5 bg-[#1A1F2E] border border-zinc-800/70 rounded-2xl shadow-subtle flex flex-col justify-between min-h-[160px]"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-sm font-extrabold text-white">🎯 {g.title}</h4>
                    <button
                      onClick={() => onDeleteGoal(g.goalId)}
                      className="p-1 hover:bg-zinc-800 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-stone-400 font-mono">
                    Target: {g.targetScore} Tons | Current: {g.currentScore} T
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-stone-400">
                    <span>PROGRESS</span>
                    <span>{g.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        g.progress > 75 ? 'bg-[#3A5A40]' : g.progress > 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-stone-500 text-right mt-1">
                    Ends: {new Date(g.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Logs Timeline (Col span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white font-display">Recent Logged Entries</h3>
            <button
              onClick={() => setShowLogModal(true)}
              className="text-xs text-cyan-400 hover:text-[#33E1FF] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Action</span>
            </button>
          </div>

          <div className="p-5 bg-[#1A1F2E] border border-zinc-800/70 rounded-2xl shadow-subtle">
            <div className="flow-root max-h-[300px] overflow-y-auto pr-2 space-y-4">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No logged activities yet. Track entries using "Log Action".
                </div>
              ) : (
                logs.map((item, idx) => (
                  <div key={item.actionId} className="relative flex gap-3 text-left">
                    {idx !== logs.length - 1 && (
                      <span className="absolute top-8 left-4.5 -ml-px h-full w-0.5 bg-zinc-800" aria-hidden="true" />
                    )}
                    <div className="relative flex-shrink-0 h-9 w-9 bg-cyan-950/40 rounded-xl border border-cyan-800/30 flex items-center justify-center text-cyan-400">
                      <Clock className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 py-1 flex justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[10px] text-stone-450 mt-0.5 leading-relaxed">{item.description}</p>
                        <span className="text-[9px] text-stone-500 block mt-1.5">
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        {item.impact?.co2Saved !== 0 && (
                          <span className={`text-[10px] font-black font-mono whitespace-nowrap ${item.impact.co2Saved > 0 ? 'text-[#3A5A40]' : 'text-red-400'}`}>
                            {item.impact.co2Saved > 0 ? '-' : '+'}{Math.abs(item.impact.co2Saved).toFixed(1)} kg CO₂
                          </span>
                        )}
                        <button
                          onClick={() => onDeleteLog(item.actionId)}
                          className="p-1 hover:bg-zinc-850 text-stone-500 hover:text-red-500 rounded transition-all mt-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PREVIEWS GRID (CHALLENGES + BADGES) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Active Challenges preview */}
        <div className="p-6 bg-[#1A1F2E] border border-zinc-800/70 rounded-2xl shadow-subtle space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-white text-base">Active Challenges</h4>
            <button
              onClick={() => onNavigateToTab('challenges')}
              className="text-xs text-cyan-400 hover:underline font-semibold flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {challenges.slice(0, 2).map(c => (
              <div 
                key={c.challengeId}
                className="p-3 bg-[#0F1419] rounded-xl border border-zinc-800/40 text-xs flex justify-between items-center"
              >
                <div className="space-y-1">
                  <div className="font-bold text-stone-200">{c.name}</div>
                  <div className="text-[10px] text-stone-500">
                    Difficulty: {c.difficulty} | Reward: {c.rewardXP} XP
                  </div>
                </div>
                
                <div className="text-right space-y-1 flex-shrink-0">
                  <div className="font-extrabold text-[#3A5A40] font-mono">
                    {c.currentProgress} / {c.targetProgress} {c.challengeId === 'energy_efficiency' ? 'XP' : 'Days'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges preview */}
        <div className="p-6 bg-[#1A1F2E] border border-zinc-800/70 rounded-2xl shadow-subtle space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-white text-base">Achievements Unlocked</h4>
            <button
              onClick={() => onNavigateToTab('achievements')}
              className="text-xs text-cyan-400 hover:underline font-semibold flex items-center"
            >
              <span>View Grid</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {achievements.map((item) => (
              <div 
                key={item.badgeId}
                className="px-3 py-1.5 bg-[#0F1419] rounded-xl border border-zinc-800/40 flex items-center gap-1.5"
                title={`${item.name} - ${item.description}`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-bold text-stone-300">{item.name}</span>
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="text-xs text-stone-500 py-3">No achievements unlocked yet. Finish challenges!</div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 4. MODALS ==================== */}
      
      {/* A. LOG ACTION MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1F2E] border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-heavy text-left relative animate-scale-up space-y-6">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-zinc-800 text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Log Carbon Activity</h3>
              <p className="text-xs text-stone-400">Record a routine log or sustainable micro-habit offset.</p>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-400">Log Category</label>
                <select
                  value={logForm.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const defaultTypes = { transport: 'car_commute', food: 'beef_meal', energy: 'heating_on' };
                    setForm(prev => ({ ...prev, category: cat, activityType: defaultTypes[cat] || 'custom' }));
                  }}
                  className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                >
                  <option value="transport">Transport</option>
                  <option value="food">Food</option>
                  <option value="energy">Energy</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-400">Activity/Habit Type</label>
                {logForm.category === 'transport' && (
                  <select
                    value={logForm.activityType}
                    onChange={(e) => setLogForm(prev => ({ ...prev, activityType: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                  >
                    <option value="car_commute">🚗 Car Commute (standard footprint)</option>
                    <option value="transit_bus">🚌 Transit/Bus Trip (reduces emissions)</option>
                    <option value="custom">✨ Custom Transport</option>
                  </select>
                )}
                {logForm.category === 'food' && (
                  <select
                    value={logForm.activityType}
                    onChange={(e) => setLogForm(prev => ({ ...prev, activityType: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                  >
                    <option value="beef_meal">🥩 Meat/Beef Meal Choice (high emissions)</option>
                    <option value="veg_meal">🥬 Vegetarian/Vegan Meal (reduces emissions)</option>
                    <option value="custom">✨ Custom Food</option>
                  </select>
                )}
                {logForm.category === 'energy' && (
                  <select
                    value={logForm.activityType}
                    onChange={(e) => setLogForm(prev => ({ ...prev, activityType: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                  >
                    <option value="heating_on">🔥 Standard Grid Heating/AC usage</option>
                    <option value="led_lights">💡 Installed Energy-efficient Bulbs</option>
                    <option value="custom">✨ Custom Energy Option</option>
                  </select>
                )}
              </div>

              {logForm.activityType === 'custom' && (
                <div className="space-y-4 animate-scale-up">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400">Custom Title</label>
                    <input 
                      type="text"
                      placeholder="e.g., Rooftop solar hot water"
                      value={logForm.customTitle}
                      onChange={(e) => setLogForm(prev => ({ ...prev, customTitle: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400">Simulated Saving/Offset (kg CO₂)</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={logForm.co2Saved}
                      onChange={(e) => setLogForm(prev => ({ ...prev, co2Saved: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#00D9FF] hover:bg-[#33E1FF] text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-subtle flex items-center justify-center gap-1.5"
              >
                <span>Record Action</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* B. GOAL CREATION MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1F2E] border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-heavy text-left relative animate-scale-up space-y-6">
            <button
              onClick={() => setShowGoalModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-zinc-800 text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Create Reduction Goal</h3>
              <p className="text-xs text-stone-400">Define a targets parameters to gauge improvement.</p>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-400 font-semibold">Goal Description</label>
                <input 
                  type="text"
                  placeholder="e.g., Keep annual footprint under 5.0 Tons"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-400">Target Score (Tons CO₂/year)</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={carbonScore.results.totalTonnes}
                  value={goalForm.targetScore}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, targetScore: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-400">Goal Timeline Duration</label>
                <select
                  value={goalForm.deadlineDays}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, deadlineDays: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#0F1419] border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:outline-none text-stone-200 text-sm"
                >
                  <option value="7">1 Week</option>
                  <option value="30">1 Month</option>
                  <option value="90">3 Months</option>
                  <option value="180">6 Months</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00D9FF] hover:bg-[#33E1FF] text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-subtle flex items-center justify-center gap-1.5"
              >
                <span>Initialize Goal</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

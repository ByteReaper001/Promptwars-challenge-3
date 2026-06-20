import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldAlert, Award, ArrowRight, Zap, Check, 
  HelpCircle, ChevronRight, ChevronDown, CheckSquare, Square, 
  Car, Home, Utensils, ShoppingBag, Trash2, ShieldCheck, DollarSign
} from 'lucide-react';
import { SVGDonutChart, SVGComparisonChart } from './SVGCharts';
import { SIMULATOR_ACTIONS } from '../utils/engine';

export default function ResultsPage({ carbonScore, onSaveAction, onNavigateToDashboard }) {
  const { results, answers, insights } = carbonScore;
  const userScore = results.totalTonnes;
  const rating = results.rating;

  // Simulator state
  const [selectedActions, setSelectedActions] = useState([]);
  const [simulatedScore, setSimulatedScore] = useState(userScore);
  const [animatedScore, setAnimatedScore] = useState(userScore);

  // Expanded insights state
  const [expandedInsight, setExpandedInsight] = useState(null);

  // Highlighted category state from donut chart
  const [activeCategory, setActiveCategory] = useState(null);

  // Category descriptions and labels
  const categoriesMeta = {
    transportation: { label: 'Transportation', icon: Car, color: 'text-emerald-500', border: 'border-emerald-500', val: results.transportationCO2, unit: 'kg', bg: 'bg-emerald-500' },
    homeEnergy: { label: 'Home Energy', icon: Home, color: 'text-sky-400', border: 'border-sky-400', val: results.homeEnergyCO2, unit: 'kg', bg: 'bg-sky-400' },
    food: { label: 'Diet & Food', icon: Utensils, color: 'text-lime-500', border: 'border-lime-500', val: results.foodCO2, unit: 'kg', bg: 'bg-lime-500' },
    shopping: { label: 'Shopping', icon: ShoppingBag, color: 'text-amber-500', border: 'border-amber-500', val: results.shoppingCO2, unit: 'kg', bg: 'bg-amber-500' },
    waste: { label: 'Waste', icon: Trash2, color: 'text-red-500', border: 'border-red-500', val: results.wasteCO2, unit: 'kg', bg: 'bg-red-500' }
  };

  // Toggle simulator actions
  const handleToggleAction = (action) => {
    setSelectedActions(prev => {
      const idx = prev.findIndex(a => a.id === action.id);
      if (idx > -1) {
        return prev.filter(a => a.id !== action.id);
      } else {
        return [...prev, action];
      }
    });
  };

  // Recalculate simulated score when actions change
  useEffect(() => {
    const totalReductionKg = selectedActions.reduce((sum, act) => sum + act.co2Saved, 0);
    const totalReductionTonnes = totalReductionKg / 1000;
    const newScore = Math.max(0.2, userScore - totalReductionTonnes);
    setSimulatedScore(Number(newScore.toFixed(2)));
  }, [selectedActions, userScore]);

  // Animate numbers smoothly
  useEffect(() => {
    let animationFrame;
    const diff = simulatedScore - animatedScore;
    if (Math.abs(diff) < 0.02) {
      setAnimatedScore(simulatedScore);
      return;
    }

    const step = () => {
      setAnimatedScore(prev => {
        const nextVal = prev + diff * 0.15;
        if (Math.abs(nextVal - simulatedScore) < 0.02) {
          cancelAnimationFrame(animationFrame);
          return simulatedScore;
        }
        return Number(nextVal.toFixed(2));
      });
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [simulatedScore]);

  // Handle Save Action Log
  const triggerSaveAction = (action) => {
    onSaveAction({
      actionId: `custom_act_${Date.now()}`,
      type: 'action_logged',
      title: action.label,
      description: action.desc,
      date: new Date().toISOString(),
      impact: { co2Saved: action.co2Saved / 52, estimatedAnnual: action.co2Saved } // log weekly co2
    });
  };

  // Badge configuration based on rating
  const getRatingBadge = () => {
    const badges = {
      'EXCELLENT': { color: 'bg-emerald-500 text-white', label: 'EXCELLENT', icon: ShieldCheck, text: 'Eco-Champion' },
      'GOOD': { color: 'bg-emerald-600 text-white', label: 'GOOD', icon: Award, text: 'Sustainability Ally' },
      'AVERAGE': { color: 'bg-amber-500 text-white', label: 'AVERAGE', icon: Sparkles, text: 'Average Impact' },
      'HIGH IMPACT': { color: 'bg-orange-500 text-white', label: 'HIGH IMPACT', icon: ShieldAlert, text: 'High Emission footprint' },
      'CRITICAL': { color: 'bg-red-500 text-white', label: 'CRITICAL', icon: ShieldAlert, text: 'Action Needed immediately' }
    };
    return badges[rating] ?? { color: 'bg-amber-500 text-white', label: 'AVERAGE', icon: Sparkles, text: 'Average Impact' };
  };

  const badgeMeta = getRatingBadge();
  const RatingIcon = badgeMeta.icon;

  // Calculate circular gauge offset (sustainable target = 2 tons, avg = 7.4)
  // Circumference of circular gauge = 282.7 (radius = 45)
  const circularCirc = 2 * Math.PI * 45;
  const sustainabilityGoal = 2.0;
  // Progress towards sustainable target (capped at 100%)
  // If user score is 2 or less, progress is 100%. If score is high (e.g. 15), progress is lower.
  const progressPercent = Math.round(Math.max(10, Math.min(100, (sustainabilityGoal / userScore) * 100)));
  const circularOffset = circularCirc - (progressPercent / 100) * circularCirc;

  return (
    <div className="animate-fade-in py-8 px-4 max-w-7xl mx-auto space-y-16">
      
      {/* SECTION 1: YOUR CARBON SCORE HERO */}
      <section className="bg-gradient-to-br from-emerald-950 to-emerald-850 rounded-3xl p-8 md:p-12 text-white shadow-heavy relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <div className="text-left space-y-4 max-w-xl relative">
          <span className="px-3 py-1 bg-emerald-500/30 text-emerald-350 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
            Footprint Calculation Results
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Your Annual Carbon Score
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Your personal lifestyle and routine choices generate approximately <span className="font-extrabold">{userScore} tons</span> of greenhouse gases each year. See how you breakdown and reduce your emissions below.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-subtle ${badgeMeta.color}`}>
              <RatingIcon className="w-4.5 h-4.5" />
              <span>{badgeMeta.label} RATING</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-white/10 border border-white/10">
              <span className="text-emerald-300">🌿 {badgeMeta.text}</span>
            </div>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-4 shadow-heavy relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="45"
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            <circle
              cx="96"
              cy="96"
              r="45"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="10"
              strokeDasharray={circularCirc}
              strokeDashoffset={circularOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
            <span className="text-4xl font-extrabold tracking-tight">{userScore}</span>
            <span className="text-[10px] text-emerald-250 font-bold uppercase tracking-wide">Tons CO₂/yr</span>
            <span className="text-[9px] text-emerald-100/75 mt-1">{progressPercent}% to Target</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: DYNAMIC BREAKDOWN DONUT & INFO CARDS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Donut interactive */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-3xl shadow-subtle">
          <h3 className="text-lg font-black text-stone-900 dark:text-white text-left mb-2">Category Emissions Breakdown</h3>
          <p className="text-xs text-stone-500 dark:text-zinc-500 text-left mb-6">Hover over any segment to inspect category emission shares.</p>
          <SVGDonutChart 
            data={results.breakdown} 
            categories={categoriesMeta} 
            activeCategory={activeCategory}
            onCategoryHover={setActiveCategory}
          />
        </div>

        {/* Categories Details list */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(results.breakdown).map(([key, val]) => {
            const meta = categoriesMeta[key];
            const Icon = meta.icon;
            const isHovered = activeCategory === key;
            return (
              <div 
                key={key}
                onMouseEnter={() => setActiveCategory(key)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-5 rounded-2xl bg-white dark:bg-zinc-900 border text-left flex justify-between items-start transition-all duration-300 ${
                  isHovered 
                    ? 'border-emerald-500 shadow-medium scale-[1.02]' 
                    : 'border-stone-150 dark:border-zinc-850 shadow-subtle'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 ${meta.color} border border-stone-100 dark:border-zinc-850`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">{meta.label}</h4>
                      <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-semibold">{val}% of total</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-stone-900 dark:text-white">
                    {(meta.val).toLocaleString()} <span className="text-xs text-stone-400 dark:text-zinc-500 font-semibold">{meta.unit}</span>
                  </div>
                </div>
                
                {/* Visual mini-indicator */}
                <div className="w-1.5 h-12 rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
                  <div className={`h-full rounded-full ${meta.bg}`} style={{ height: `${val}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: CATEGORY COMPARISON BENCHMARKS */}
      <section className="space-y-8">
        <div className="text-left max-w-xl space-y-1">
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">Emissions Compared to Benchmarks</h3>
          <p className="text-sm text-stone-500 dark:text-zinc-400">See how your footprint matches other averages in tons CO₂/year.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: TRANSPORTATION */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-2xl shadow-subtle text-left space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-stone-850 dark:text-zinc-200 flex items-center gap-1.5">
                <Car className="w-5 h-5 text-emerald-500" />
                Transportation
              </h4>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 px-2.5 py-0.5 rounded-full font-bold">
                {results.transportationCO2 < 4200 ? '21% below avg ✓' : 'Above average'}
              </span>
            </div>
            
            {/* SVG comparative bars */}
            <SVGComparisonChart 
              userVal={results.transportationCO2 / 1000} 
              countryVal={4.2} 
              globalVal={5.1} 
              targetVal={1.8} 
            />
          </div>

          {/* Card 2: HOME ENERGY */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-2xl shadow-subtle text-left space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-stone-850 dark:text-zinc-200 flex items-center gap-1.5">
                <Home className="w-5 h-5 text-sky-400" />
                Home Energy
              </h4>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 px-2.5 py-0.5 rounded-full font-bold">
                {results.homeEnergyCO2 < 2000 ? 'On Track ✓' : 'Action Needed'}
              </span>
            </div>

            <SVGComparisonChart 
              userVal={results.homeEnergyCO2 / 1000} 
              countryVal={2.9} 
              globalVal={3.2} 
              targetVal={1.0} 
            />
          </div>

          {/* Card 3: FOOD */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-2xl shadow-subtle text-left space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-stone-850 dark:text-zinc-200 flex items-center gap-1.5">
                <Utensils className="w-5 h-5 text-lime-500" />
                Diet & Food
              </h4>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 px-2.5 py-0.5 rounded-full font-bold">
                {results.foodCO2 < 1200 ? 'Eco Diet ✓' : 'Meat Reduction Option'}
              </span>
            </div>

            <SVGComparisonChart 
              userVal={results.foodCO2 / 1000} 
              countryVal={1.8} 
              globalVal={1.9} 
              targetVal={0.8} 
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: PERSONALIZED INSIGHTS */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">Your Personalized Insights</h3>
          <p className="text-sm text-stone-500 dark:text-zinc-400">Based on your carbon assessment, here are our key findings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => {
            const isExpanded = expandedInsight === insight.id;
            const meta = categoriesMeta[insight.category] ?? { color: 'border-stone-200', bg: 'bg-stone-50' };
            return (
              <div 
                key={insight.id}
                onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                className={`p-6 bg-white dark:bg-zinc-900 border-l-4 ${meta.border} rounded-2xl shadow-subtle text-left flex flex-col justify-between items-start space-y-4 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className="space-y-2.5 w-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm font-extrabold text-stone-850 dark:text-zinc-200">
                      {insight.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      insight.impactPotential === 'high' 
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400' 
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                    }`}>
                      {insight.impactPotential.toUpperCase()} IMPACT
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                    {insight.message}
                  </p>
                </div>

                <div className="w-full flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-450 font-bold pt-2">
                  <span>Learn more</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>

                {isExpanded && (
                  <div className="w-full pt-3 mt-3 border-t border-stone-100 dark:border-zinc-800 text-[11px] text-stone-500 dark:text-zinc-450 leading-relaxed animate-scale-up">
                    Standard conversion metrics from the EPA demonstrate that target adjustments in this category yield immediate, compounding reductions.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: TOP REDUCTION ACTIONS */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">Your Top Actions to Reduce Emissions</h3>
          <p className="text-sm text-stone-500 dark:text-zinc-400">Ranked by impact potential for your situation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIMULATOR_ACTIONS.slice(0, 3).map((act) => (
            <div 
              key={act.id} 
              className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-3xl shadow-subtle hover:shadow-medium hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between min-h-[240px]"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    DIFFICULTY: {act.diff}
                  </span>
                  <span className="text-[10px] bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 font-bold px-2 py-0.5 rounded-full">
                    COST: {act.cost}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-850 dark:text-zinc-200 text-base">{act.label}</h4>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">{act.desc}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 bg-stone-50 dark:bg-zinc-950 p-3 rounded-xl border border-stone-100 dark:border-zinc-850 text-xs">
                  <div>
                    <div className="text-stone-400 text-[10px]">CO₂ Reduction</div>
                    <div className="font-extrabold text-stone-800 dark:text-zinc-350">~{act.co2Saved} kg/yr</div>
                  </div>
                  <div>
                    <div className="text-stone-400 text-[10px]">Money Saved</div>
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-450">${act.moneySaved}/yr</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => triggerSaveAction(act)}
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-subtle"
                >
                  Save Action
                </button>
                <button
                  onClick={() => onNavigateToDashboard('challenges')}
                  className="flex-1 py-2 border border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 rounded-lg text-xs font-bold transition-all"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: CARBON REDUCTION SIMULATOR */}
      <section className="bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Toggle List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">See Your Impact in Real-Time</h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400">Toggle carbon mitigation efforts below to instantly simulate target footprint improvements.</p>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
            {SIMULATOR_ACTIONS.map((action) => {
              const isSelected = selectedActions.some(a => a.id === action.id);
              return (
                <div 
                  key={action.id}
                  onClick={() => handleToggleAction(action)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-emerald-600 bg-white dark:bg-zinc-950 font-bold scale-[1.01]'
                      : 'border-stone-150 dark:border-zinc-850 bg-white/50 dark:bg-zinc-950/20 hover:border-stone-200 dark:hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300 dark:text-zinc-750" />
                    )}
                    <span className="text-sm text-stone-850 dark:text-zinc-200">{action.label}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    -{action.co2Saved} kg CO₂
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Simulator Output Counter */}
        <div className="lg:col-span-5 p-6 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 rounded-2xl flex flex-col justify-between space-y-6 shadow-medium relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-xl" />
          
          <div className="space-y-4">
            <div className="text-xs text-stone-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Simulator Forecast</div>
            <div className="space-y-1">
              <div className="text-xs text-stone-500 dark:text-zinc-450">Current Footprint: {userScore} Tons</div>
              <div className="text-3xl font-black text-stone-900 dark:text-white flex items-baseline gap-1">
                <span>{animatedScore.toFixed(2)}</span>
                <span className="text-sm font-semibold text-stone-400 dark:text-zinc-500">Tons CO₂/year</span>
              </div>
            </div>
            
            {/* Savings stats */}
            {selectedActions.length > 0 && (
              <div className="space-y-1 bg-emerald-50/35 dark:bg-emerald-950/10 p-3.5 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30 text-xs animate-scale-up">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 dark:text-zinc-400">Total Reduction:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {(selectedActions.reduce((sum, a) => sum + a.co2Saved, 0) / 1000).toFixed(2)} Tons
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-stone-600 dark:text-zinc-400">Footprint Improvement:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {Math.round(((userScore - simulatedScore) / userScore) * 100)}% decrease
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              selectedActions.forEach(triggerSaveAction);
              onNavigateToDashboard('dashboard');
            }}
            disabled={selectedActions.length === 0}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-150 disabled:text-stone-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-medium hover:shadow-heavy transition-all duration-150 text-sm"
          >
            <span>Build Your Plan ({selectedActions.length})</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>

      {/* SECTION 7: CALL TO ACTION */}
      <section className="text-center py-6 space-y-4">
        <button
          onClick={() => onNavigateToDashboard('dashboard')}
          className="px-10 py-4.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold inline-flex items-center gap-2 shadow-medium hover:shadow-heavy active:scale-98 transition-all duration-150 text-base"
        >
          <span>Start Tracking Your Progress</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-stone-400 dark:text-zinc-500">
          Create an account or use storage sessions to persist your milestones and track carbon score improvements.
        </p>
      </section>

    </div>
  );
}

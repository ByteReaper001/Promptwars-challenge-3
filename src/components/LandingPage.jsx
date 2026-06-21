import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Globe, Leaf, Users, Zap, Utensils, Car, ShoppingBag, 
  Trash2, Sparkles, ClipboardCheck, BarChart3, TrendingDown 
} from 'lucide-react';

export default function LandingPage({ onStartCalculator, onExploreDemo }) {
  // Stats counter state
  const [counts, setCounts] = useState({
    activeUsers: 0,
    tonsSaved: 0,
    treesPlanted: 0,
    energySaved: 0,
  });

  useEffect(() => {
    // Tick animation for landing page metrics
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const targets = {
      activeUsers: 142380,
      tonsSaved: 2480,
      treesPlanted: 62000,
      energySaved: 850000,
    };

    const timer = setInterval(() => {
      step++;
      setCounts({
        activeUsers: Math.floor((targets.activeUsers / steps) * step),
        tonsSaved: Number(((targets.tonsSaved / steps) * step).toFixed(1)),
        treesPlanted: Math.floor((targets.treesPlanted / steps) * step),
        energySaved: Math.floor((targets.energySaved / steps) * step),
      });

      if (step >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in py-8 px-4 max-w-7xl mx-auto space-y-24">
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-[#00D9FF] text-sm font-semibold animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Introducing Carbonlytics v2.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white font-display">
            Understand Your Impact. <br />
            <span className="text-cyan-400 bg-gradient-to-r from-cyan-400 to-[#3A5A40] bg-clip-text text-transparent">Feel Your Carbon Footprint.</span> <br />
            Build a Greener Future.
          </h1>
          <p className="text-base text-stone-400 max-w-xl">
            Track your daily emissions, discover high-impact actions, and map your footprint into a living waveform. Personal micro-habits private-by-default.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onStartCalculator}
              className="px-8 py-4 bg-[#00D9FF] hover:bg-[#33E1FF] text-[#0F1419] rounded-xl font-bold flex items-center gap-2 shadow-heavy transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200"
            >
              <span>Calculate My Footprint</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExploreDemo}
              className="px-8 py-4 border-2 border-cyan-400 hover:bg-cyan-950/20 text-[#00D9FF] rounded-xl font-bold transition-all duration-200"
            >
              Explore Dashboard Demo
            </button>
          </div>
        </div>

        {/* Hero Visual Card (Animated Globe concept) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[420px] p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shadow-heavy overflow-hidden group">
            {/* Soft decorative gradients */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative space-y-6">
              {/* Fake Globe Visual */}
              <div className="flex justify-center py-4">
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-900 to-sky-950 flex items-center justify-center shadow-heavy border border-emerald-500/20">
                  {/* Outer Orbit */}
                  <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-4 border border-dashed border-emerald-500/20 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                  
                  {/* Globe Silhouette */}
                  <Globe className="w-32 h-32 text-emerald-400/80 dark:text-emerald-400 animate-pulse" />
                  
                  {/* floating nodes */}
                  <div className="absolute top-4 left-6 w-3 h-3 bg-lime-400 rounded-full animate-bounce shadow-md" />
                  <div className="absolute bottom-8 right-6 w-2.5 h-2.5 bg-sky-400 rounded-full animate-pulse shadow-md" />
                </div>
              </div>

              {/* Real-time Demo metrics panel */}
              <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-100 dark:border-zinc-850">
                <div className="text-left">
                  <div className="text-xs text-stone-500 dark:text-zinc-500">Avg Footprint</div>
                  <div className="text-lg font-bold text-stone-800 dark:text-zinc-200">7.4 tons CO₂</div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-stone-500 dark:text-zinc-500">Trees Equivalency</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">124 Trees</div>
                </div>
                <div className="text-left border-t border-stone-150 dark:border-zinc-800 pt-2 col-span-2 flex justify-between items-center">
                  <span className="text-xs text-stone-500 dark:text-zinc-500">Community Users</span>
                  <span className="text-sm font-bold text-stone-800 dark:text-zinc-200 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    {counts.activeUsers.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">Why Track Carbon Emissions?</h2>
          <p className="text-stone-600 dark:text-zinc-400">Understanding where global and individual carbon comes from is the first step to reducing it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Card 1: 8 Billion */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shadow-subtle flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <div className="text-2xl font-black text-stone-900 dark:text-white">8+ Billion</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Global Population</div>
              <p className="text-sm text-stone-600 dark:text-zinc-400">People impacting the global climate footprint daily.</p>
            </div>
          </div>

          {/* Card 2: 4.8 tons */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shadow-subtle flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <div className="text-2xl font-black text-stone-900 dark:text-white">4.8 Tons</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Average Footprint</div>
              <p className="text-sm text-stone-600 dark:text-zinc-400">Average personal emissions produced per person each year.</p>
            </div>
          </div>

          {/* Card 3: Transport 29% */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shadow-subtle flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-450">
              <Car className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <div className="text-2xl font-black text-stone-900 dark:text-white">29%</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Transportation</div>
              <p className="text-sm text-stone-600 dark:text-zinc-400">The share of standard household emissions from driving & travel.</p>
            </div>
          </div>

          {/* Card 4: Food 26% */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shadow-subtle flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-lime-100 dark:bg-lime-950/50 text-lime-600 dark:text-lime-400">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <div className="text-2xl font-black text-stone-900 dark:text-white">26%</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Food & Diet</div>
              <p className="text-sm text-stone-600 dark:text-zinc-400">Contributions from agricultural carbon output and dietary choices.</p>
            </div>
          </div>

          {/* Card 5: Energy 25% */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-800 shadow-subtle flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-medium transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <div className="text-2xl font-black text-stone-900 dark:text-white">25%</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Home Energy</div>
              <p className="text-sm text-stone-600 dark:text-zinc-400">Carbon footprints related to household heating, AC, and lighting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">How Carbonlytics Works</h2>
          <p className="text-stone-600 dark:text-zinc-400">Take charge of your personal environmental impact in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center space-y-4 relative group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform duration-300">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-450">Step 1</div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Assess Your Habits</h3>
            <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-xs mx-auto">
              Answer short questions about your travel, household energy usage, diet, shopping frequency, and recycling habits in under 2 minutes.
            </p>
            {/* Connector Arrow (Desktop only) */}
            <div className="hidden md:block absolute top-8 -right-4 translate-x-1/2 text-stone-300 dark:text-zinc-700">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4 relative group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-450">Step 2</div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Analyze Your Score</h3>
            <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-xs mx-auto">
              Review custom dashboard breakdowns, identify largest contributors, and contrast scores against country-wide and global averages.
            </p>
            {/* Connector Arrow (Desktop only) */}
            <div className="hidden md:block absolute top-8 -right-4 translate-x-1/2 text-stone-300 dark:text-zinc-700">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4 relative group">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-8 h-8" />
            </div>
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-450">Step 3</div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Improve & Track</h3>
            <p className="text-sm text-stone-600 dark:text-zinc-400 max-w-xs mx-auto">
              Join active eco-challenges, log milestones, secure achievements, and witness your real-time stats decline with each task completed.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA SECTION */}
      <section className="bg-gradient-to-br from-emerald-900 to-forest-green p-12 rounded-[32px] text-white text-center space-y-6 relative overflow-hidden shadow-heavy">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        <div className="relative space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Start Your Carbon Journey?</h2>
          <p className="text-emerald-100 text-base md:text-lg">
            Join thousands of sustainability advocates tracking emissions, changing household routines, and creating localized impacts.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onStartCalculator}
              className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-medium hover:shadow-heavy transition-all duration-200"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

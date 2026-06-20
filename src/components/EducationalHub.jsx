import React, { useState } from 'react';
import { BookOpen, Compass, ArrowRight, Clock, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function EducationalHub() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 'carbon_math',
      title: 'Decoding Carbon Math: How Factors are Calculated',
      category: 'Science',
      readTime: '4 min read',
      icon: '🧮',
      summary: 'Explore the EPA and IPCC methodologies used to convert daily energy usage, car mileage, and diet behaviors into kg of CO₂ equivalents.',
      content: `Have you ever wondered why driving one mile in a standard car produces 404 grams of carbon dioxide? Or why heating water electrically accounts for nearly double the carbon of heat pumps?

This is because of carbon conversion coefficients. Environmental protection agencies globally compile data on typical combustion metrics:
1. Gasoline contains carbon atoms that, when burned, bind with atmospheric oxygen to create CO₂.
2. Electrical grid emissions depend heavily on regional fuel sources. In the USA, the grid average is around 0.385 kg CO₂ per kWh produced.
3. Natural gas heating releases carbon at about 0.185 kg CO₂ per equivalent kWh of thermal energy.

By keeping track of these coefficients, CarbonPath helps you trace and offset actual emissions output in real-time.`
    },
    {
      id: 'flying_footprint',
      title: 'The Outsized Impact of Air Travel',
      category: 'Transport',
      readTime: '5 min read',
      icon: '✈️',
      summary: 'Why flights contribute massive spikes to your carbon footprint and how to make conscious travel choices to limit your footprint.',
      content: `A single round-trip flight from New York to London emits about 1.2 tons of carbon dioxide per passenger. For many individuals, this single trip represents more than 20% of their total annual footprint.

Why is air travel so carbon-heavy?
- Airplanes consume enormous volumes of kerosene fuel.
- Emissions at high altitudes have a stronger radiative forcing effect, amplifying warming.
- Unlike trains or electric vehicles, commercial aviation has very few immediate low-carbon alternatives.

Conscious adjustments, such as opting for virtual meetings or taking trains for trips under 300 miles, are the single fastest ways to lower personal carbon output.`
    },
    {
      id: 'food_emissions',
      title: 'Diet and Climate: The Greenhouse Gas in Your Kitchen',
      category: 'Diet & Food',
      readTime: '3 min read',
      icon: '🥗',
      summary: 'How agricultural choices shape emissions. Why red meats carry an outsized footprint and how vegetarian swaps save emissions.',
      content: `Food accounts for nearly 26% of global greenhouse gas emissions. However, the footprint is not distributed equally.

Beef and lamb produce approximately 60 kg of greenhouse gases per kg of meat, compared to just 7 kg for poultry and less than 1 kg for root vegetables.
This massive disparity comes from:
- Methane emissions from ruminant digestive cycles.
- Land clearance requirements for pasture feed.
- High resource consumption rates.

Adopting a plant-based diet or replacing beef with chicken twice a week offers substantial carbon savings, helping lower emissions by up to 400 kg CO₂ annually.`
    }
  ];

  // Roadmap timeline data
  const timelineMilestones = [
    { title: 'Carbon Assessment', desc: 'Complete the 5-step carbon footprint calculator.', completed: true, icon: '📋' },
    { title: 'First Eco Action', desc: 'Log your first daily habit offset (e.g. Biking, sorting trash).', completed: true, icon: '🌱' },
    { title: 'The 7-Day Streak', desc: 'Maintain a consecutive 7-day action checkin streak.', completed: true, icon: '🔥' },
    { title: '10% Footprint Cut', desc: 'Simulate or achieve a 10% footprint reduction target.', completed: false, icon: '📉' },
    { title: 'Clean Energy transition', desc: 'Install solar panel offsets or source 100% renewable power.', completed: false, icon: '☀️' },
    { title: 'EV Commuting', desc: 'Transition personal driving to electric vehicles or cycles.', completed: false, icon: '🚗' },
    { title: 'Net-Zero Footprint', desc: 'Bring total emissions under 2.0 Tons CO₂/year.', completed: false, icon: '🌍' }
  ];

  return (
    <div className="animate-fade-in py-8 px-4 max-w-7xl mx-auto space-y-12 text-left">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
          📚 Educational Hub & Roadmap
        </h2>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Learn the carbon science behind climate metrics and follow the milestones towards a net-zero future.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ARTICLES HUB (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-black text-stone-900 dark:text-white">Curated Climate Articles</h3>
          
          <div className="space-y-4">
            {articles.map((art) => (
              <div 
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-2xl shadow-subtle hover:shadow-medium transition-all duration-200 text-left flex gap-4 cursor-pointer"
              >
                <span className="text-4xl">{art.icon}</span>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-stone-400 dark:text-zinc-550 font-semibold flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-stone-900 dark:text-white mt-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROADMAP TIMELINE (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-black text-stone-900 dark:text-white">Net-Zero Reduction Roadmap</h3>

          <div className="p-6 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-3xl shadow-subtle relative">
            <div className="absolute top-8 bottom-8 left-9.5 w-0.5 bg-stone-100 dark:bg-zinc-800" />

            <div className="space-y-6">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative flex gap-4 text-left">
                  <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center text-sm ${
                    m.completed 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 dark:text-emerald-450' 
                      : 'bg-stone-50 dark:bg-zinc-950 border-stone-200 dark:border-zinc-850 text-stone-400'
                  }`}>
                    <span>{m.icon}</span>
                  </div>
                  <div className="py-0.5">
                    <h4 className={`text-xs font-bold ${m.completed ? 'text-stone-850 dark:text-zinc-200' : 'text-stone-400'}`}>
                      {m.title}
                      {m.completed && <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-1.5">(Achieved)</span>}
                    </h4>
                    <p className="text-[10px] text-stone-500 dark:text-zinc-450 mt-0.5 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ARTICLE CONTENT DIALOG */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-850 rounded-3xl p-6 w-full max-w-lg shadow-heavy text-left relative animate-scale-up space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 hover:text-stone-850 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedArticle.icon}</span>
                <div>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white mt-1">{selectedArticle.title}</h3>
                </div>
              </div>

              <hr className="border-stone-100 dark:border-zinc-800" />

              <div className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

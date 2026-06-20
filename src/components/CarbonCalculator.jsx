import React, { useState } from 'react';
import { 
  Car, Home, Utensils, ShoppingBag, Trash2, ArrowLeft, ArrowRight,
  Plane, Bus, Compass, Zap, Flame, Info, Check, Package, Shirt, Laptop 
} from 'lucide-react';

export default function CarbonCalculator({ onCalculate, initialAnswers }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Initialize form state
  const [form, setForm] = useState(initialAnswers || {
    transportation: {
      carDaysPerWeek: 5,
      carMilesPerDay: 20,
      flightFrequency: '1-2',
      publicTransit: 'never',
      bikeOrWalk: false
    },
    homeEnergy: {
      electricityKwhMonthly: 400,
      waterHeatingType: 'electric',
      acUsage: 'summer',
      renewablePercentage: 10,
      applianceCount: 12
    },
    food: {
      dietType: 'mixed',
      meatDaysPerWeek: 3,
      beefOrLambDaysPerWeek: 1,
      localOrganicFrequency: 'sometimes'
    },
    shopping: {
      onlineShoppingPerMonth: 5,
      fastFashionPerMonth: 1,
      electronicsPurchasesPerYear: 2,
      recyclingFrequency: 'regularly'
    },
    waste: {
      wasteKgPerWeek: 15,
      composting: false,
      plasticUsageLevel: 'medium',
      reusesItems: false
    }
  });

  const updateField = (category, field, value) => {
    setForm(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  // Skip step
  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      onCalculate(form);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      onCalculate(form);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  // Step names & Icons
  const stepMeta = [
    { title: 'Transportation', icon: Car, desc: 'How Do You Move?' },
    { title: 'Home Energy', icon: Home, desc: "Your Home's Energy" },
    { title: 'Diet & Food', icon: Utensils, desc: 'Your Food Choices' },
    { title: 'Shopping', icon: ShoppingBag, desc: 'Shopping & Apparel' },
    { title: 'Waste', icon: Trash2, desc: 'Waste & Recycling' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in-up">
      {/* 1. PROGRESS BAR */}
      <div className="mb-10 space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold text-stone-500 dark:text-zinc-400">
          <span className="text-emerald-700 dark:text-emerald-450 uppercase tracking-wider text-xs">
            Step {step} of {totalSteps}: {stepMeta[step - 1].title}
          </span>
          <span>{Math.round(((step - 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-stone-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Stepper icons */}
        <div className="flex justify-between items-center px-2">
          {stepMeta.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = idx + 1 < step;
            const isActive = idx + 1 === step;
            return (
              <button
                key={idx}
                disabled={idx + 1 > step}
                onClick={() => setStep(idx + 1)}
                className={`flex flex-col items-center gap-1.5 focus:outline-none transition-all duration-200 ${
                  isCompleted 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : isActive 
                      ? 'text-emerald-800 dark:text-emerald-300 font-bold scale-110' 
                      : 'text-stone-400 dark:text-zinc-650'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  isCompleted 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500' 
                    : isActive 
                      ? 'bg-white dark:bg-zinc-900 border-emerald-600 shadow-medium animate-pulse' 
                      : 'bg-stone-50 dark:bg-zinc-950 border-stone-200 dark:border-zinc-850'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline text-xs mt-1">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CARD FORM CONTAINER */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-3xl p-8 shadow-heavy relative min-h-[450px] flex flex-col justify-between">
        <div className="space-y-8 animate-scale-up">
          <div className="text-left space-y-2">
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              {stepMeta[step - 1].desc}
            </h2>
            <p className="text-sm text-stone-500 dark:text-zinc-450">
              Provide accurate values to get the best assessment. You can always adjust these later.
            </p>
          </div>

          <hr className="border-stone-100 dark:border-zinc-800" />

          {/* STEP 1 CONTENT: TRANSPORTATION */}
          {step === 1 && (
            <div className="space-y-6 text-left">
              {/* Q1: Car Driving days */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350">
                    How many days per week do you drive a personal car?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.transportation.carDaysPerWeek} days/week
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="7" 
                  value={form.transportation.carDaysPerWeek}
                  onChange={(e) => updateField('transportation', 'carDaysPerWeek', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q2: Average Distance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350">
                    Average distance driven on those days (miles)?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.transportation.carMilesPerDay} miles
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={form.transportation.carMilesPerDay}
                  onChange={(e) => updateField('transportation', 'carMilesPerDay', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q3: Flights Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  How often do you take flights per year?
                </label>
                <div className="relative">
                  <select
                    value={form.transportation.flightFrequency}
                    onChange={(e) => updateField('transportation', 'flightFrequency', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-850 dark:text-zinc-200"
                  >
                    <option value="none">None (0 flights)</option>
                    <option value="1-2">1-2 flights (short-haul only)</option>
                    <option value="3-5">3-5 flights (medium-haul / occasional vacation)</option>
                    <option value="6-10">6-10 flights (business or frequent traveler)</option>
                    <option value="10+">10+ flights (heavy business traveler)</option>
                  </select>
                </div>
              </div>

              {/* Q4: Public Transport Radio cards */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  Do you use public transportation?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { val: 'never', label: 'Never', days: '0 days' },
                    { val: 'occasionally', label: 'Occasionally', days: '1-2 days' },
                    { val: 'regularly', label: 'Regularly', days: '3-5 days' },
                    { val: 'primarily', label: 'Primarily', days: '6-7 days' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => updateField('transportation', 'publicTransit', opt.val)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col justify-center items-center gap-1 hover:shadow-subtle ${
                        form.transportation.publicTransit === opt.val
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-750 text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      <Bus className={`w-5 h-5 ${form.transportation.publicTransit === opt.val ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
                      <span className="text-sm mt-1">{opt.label}</span>
                      <span className="text-[10px] text-stone-400 dark:text-zinc-500">{opt.days}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: Cycle/Walk Toggle */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-stone-150 dark:border-zinc-850">
                <div className="space-y-0.5 text-left">
                  <div className="text-sm font-semibold text-stone-700 dark:text-zinc-350">Do you cycle or walk for short trips?</div>
                  <div className="text-xs text-stone-500 dark:text-zinc-450">Replacing short drive sessions reduces car wear and carbon emission.</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('transportation', 'bikeOrWalk', !form.transportation.bikeOrWalk)}
                  className={`w-14 h-7.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    form.transportation.bikeOrWalk ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`bg-white dark:bg-zinc-900 w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-300 ${
                    form.transportation.bikeOrWalk ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 CONTENT: HOME ENERGY */}
          {step === 2 && (
            <div className="space-y-6 text-left">
              {/* Q1: Electricity usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350">
                    Monthly electricity usage (kWh)?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.homeEnergy.electricityKwhMonthly} kWh (~${Math.round(form.homeEnergy.electricityKwhMonthly * 0.15)}/mo)
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={form.homeEnergy.electricityKwhMonthly}
                  onChange={(e) => updateField('homeEnergy', 'electricityKwhMonthly', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q2: Water heating */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  How is your home's water heated?
                </label>
                <select
                  value={form.homeEnergy.waterHeatingType}
                  onChange={(e) => updateField('homeEnergy', 'waterHeatingType', e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-850 dark:text-zinc-200"
                >
                  <option value="electric">Electric Heater (Standard)</option>
                  <option value="gas">Natural Gas Burner</option>
                  <option value="solar">Solar Water Heater (Low carbon)</option>
                  <option value="heatpump">Heat Pump (Eco-friendly, highly efficient)</option>
                  <option value="unknown">Don't know</option>
                </select>
              </div>

              {/* Q3: Air conditioning */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  Do you use air conditioning (AC)?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'none', label: 'No AC' },
                    { val: 'summer', label: 'Summer Only' },
                    { val: 'yearround', label: 'Year-Round' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => updateField('homeEnergy', 'acUsage', opt.val)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        form.homeEnergy.acUsage === opt.val
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-750 text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Renewable % */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-stone-700 dark:text-zinc-350 flex items-center gap-1.5">
                    What % of your electricity is from renewable sources?
                    {form.homeEnergy.renewablePercentage > 50 && (
                      <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    )}
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.homeEnergy.renewablePercentage}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={form.homeEnergy.renewablePercentage}
                  onChange={(e) => updateField('homeEnergy', 'renewablePercentage', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q5: Appliances Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350">
                    How many electric appliances does your household utilize?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.homeEnergy.applianceCount} items
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={form.homeEnergy.applianceCount}
                  onChange={(e) => updateField('homeEnergy', 'applianceCount', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* STEP 3 CONTENT: DIET & FOOD */}
          {step === 3 && (
            <div className="space-y-6 text-left">
              {/* Q1: Primary Diet cards */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  What is your primary diet?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'vegan', label: '🌱 Vegan', desc: 'Strictly plant-based' },
                    { val: 'vegetarian', label: '🥬 Vegetarian', desc: 'No meat, dairy/eggs OK' },
                    { val: 'mixed', label: '🍗 Mixed Diet', desc: 'Meat & plants balanced' },
                    { val: 'meatHeavy', label: '🥩 Meat-Heavy', desc: 'Eat red meat / poultry daily' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => {
                        updateField('food', 'dietType', opt.val);
                        if (opt.val === 'vegan') {
                          updateField('food', 'meatDaysPerWeek', 0);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all hover:shadow-subtle ${
                        form.food.dietType === opt.val
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-stone-850 dark:text-zinc-200'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-750 text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      <div className="font-bold text-sm">{opt.label}</div>
                      <div className="text-xs text-stone-400 dark:text-zinc-500 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Meat days (hidden if vegan) */}
              {form.food.dietType !== 'vegan' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350">
                      How many days per week do you eat meat (poultry, pork, fish)?
                    </label>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {form.food.meatDaysPerWeek} days
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="7" 
                    value={form.food.meatDaysPerWeek}
                    onChange={(e) => updateField('food', 'meatDaysPerWeek', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Q3: Beef/lamb days */}
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350 flex items-center gap-1">
                    Beef or lamb consumption frequency?
                    <span className="text-[10px] bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                      High Emission Protein
                    </span>
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.food.beefOrLambDaysPerWeek} days/week
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="7" 
                  value={form.food.beefOrLambDaysPerWeek}
                  onChange={(e) => updateField('food', 'beefOrLambDaysPerWeek', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q4: Local/organic */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  How often do you buy local or organic produce?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { val: 'rarely', label: 'Rarely' },
                    { val: 'sometimes', label: 'Sometimes' },
                    { val: 'often', label: 'Often' },
                    { val: 'usually', label: 'Usually' },
                    { val: 'always', label: 'Always' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => updateField('food', 'localOrganicFrequency', opt.val)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        form.food.localOrganicFrequency === opt.val
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300 text-xs'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-750 text-stone-600 dark:text-zinc-400 text-xs'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 CONTENT: SHOPPING & CONSUMPTION */}
          {step === 4 && (
            <div className="space-y-6 text-left">
              {/* Q1: Online shopping */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350 flex items-center gap-1">
                    <Package className="w-4 h-4 text-stone-400" />
                    Online shopping purchase frequency (monthly)?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.shopping.onlineShoppingPerMonth} purchases
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={form.shopping.onlineShoppingPerMonth}
                  onChange={(e) => updateField('shopping', 'onlineShoppingPerMonth', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q2: Fast fashion */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350 flex items-center gap-1">
                    <Shirt className="w-4 h-4 text-stone-400" />
                    Fast fashion items purchased per month?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.shopping.fastFashionPerMonth} clothing items
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={form.shopping.fastFashionPerMonth}
                  onChange={(e) => updateField('shopping', 'fastFashionPerMonth', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q3: Electronics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350 flex items-center gap-1">
                    <Laptop className="w-4 h-4 text-stone-400" />
                    Electronics & device purchases (yearly)?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.shopping.electronicsPurchasesPerYear} devices/year
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={form.shopping.electronicsPurchasesPerYear}
                  onChange={(e) => updateField('shopping', 'electronicsPurchasesPerYear', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q4: Recycle frequency */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  How much of your recyclable household materials do you actually recycle?
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { val: 'never', label: 'Never' },
                    { val: 'occasionally', label: 'Occasionally' },
                    { val: 'regularly', label: 'Regularly' },
                    { val: 'always', label: 'Always' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => updateField('shopping', 'recyclingFrequency', opt.val)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        form.shopping.recyclingFrequency === opt.val
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-750 text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 CONTENT: WASTE MANAGEMENT */}
          {step === 5 && (
            <div className="space-y-6 text-left">
              {/* Q1: Waste generated */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-stone-700 dark:text-zinc-350">
                    How much landfill waste does your household generate per week?
                  </label>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {form.waste.wasteKgPerWeek} kg/week
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={form.waste.wasteKgPerWeek}
                  onChange={(e) => updateField('waste', 'wasteKgPerWeek', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Q2: Compost */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-stone-150 dark:border-zinc-850">
                <div className="space-y-0.5 text-left">
                  <div className="text-sm font-semibold text-stone-700 dark:text-zinc-350">Do you compost organic waste?</div>
                  <div className="text-xs text-stone-500 dark:text-zinc-450">Composting diverts food scraps from landfills, cutting methane.</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('waste', 'composting', !form.waste.composting)}
                  className={`w-14 h-7.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    form.waste.composting ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`bg-white dark:bg-zinc-900 w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-300 ${
                    form.waste.composting ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Q3: Plastic usage */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-zinc-350">
                  What is your single-use plastic usage level?
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { val: 'high', label: 'High' },
                    { val: 'medium', label: 'Medium' },
                    { val: 'low', label: 'Low' },
                    { val: 'none', label: 'None' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => updateField('waste', 'plasticUsageLevel', opt.val)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        form.waste.plasticUsageLevel === opt.val
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-750 text-stone-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Reuse/Repurpose items */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-stone-150 dark:border-zinc-850">
                <div className="space-y-0.5 text-left">
                  <div className="text-sm font-semibold text-stone-700 dark:text-zinc-350">Do you actively reuse or repurpose items?</div>
                  <div className="text-xs text-stone-500 dark:text-zinc-450">Upcycling and shopping second-hand reduces new manufacturing demands.</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('waste', 'reusesItems', !form.waste.reusesItems)}
                  className={`w-14 h-7.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    form.waste.reusesItems ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`bg-white dark:bg-zinc-900 w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-300 ${
                    form.waste.reusesItems ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. NAVIGATION CONTROLS */}
        <div className="flex justify-between items-center pt-8 mt-12 border-t border-stone-100 dark:border-zinc-800">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-stone-250 hover:bg-stone-50 dark:border-zinc-750 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-350 font-bold flex items-center gap-1.5 transition-all text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="text-stone-400 hover:text-stone-500 dark:text-zinc-500 dark:hover:text-zinc-400 text-sm font-medium pr-2"
            >
              Skip Step
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-medium hover:shadow-heavy active:scale-98 transition-all text-sm"
            >
              <span>{step === totalSteps ? 'Calculate Results' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

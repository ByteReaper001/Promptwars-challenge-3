// Carbon calculation engine based on standard factors (EPA, IPCC)

export const calculateEmissions = (answers) => {
  // 1. Transportation
  const carDays = Number(answers.transportation?.carDaysPerWeek ?? 5) || 0;
  const carMiles = Number(answers.transportation?.carMilesPerDay ?? 20) || 0;
  const carEmissions = carDays * carMiles * 0.404 * 52; // annual kg CO2

  const publicTransitType = answers.transportation?.publicTransit ?? 'never';
  let transitHours = 0;
  if (publicTransitType === 'occasionally') transitHours = 2;
  else if (publicTransitType === 'regularly') transitHours = 8;
  else if (publicTransitType === 'primarily') transitHours = 14;
  const transitEmissions = transitHours * 52 * 0.089; // annual kg CO2

  const flightFreq = answers.transportation?.flightFrequency ?? '1-2';
  const flightHoursMap = {
    'none': 0,
    '1-2': 1.5,
    '3-5': 4,
    '6-10': 8,
    '10+': 15
  };
  const flightHours = flightHoursMap[flightFreq] ?? 1.5;
  // flight carbonFactor is 0.255 tonnes (255 kg) per flight hour
  const flightEmissions = flightHours * 255; 

  const totalTransport = carEmissions + transitEmissions + flightEmissions;

  // 2. Home Energy
  const elecKwh = Number(answers.homeEnergy?.electricityKwhMonthly ?? 400) || 0;
  const baseElectricity = elecKwh * 12 * 0.385; // kg CO2

  const waterHeating = answers.homeEnergy?.waterHeatingType ?? 'electric';
  const waterHeatingFactors = {
    'electric': 0.385,
    'gas': 0.185,
    'solar': 0,
    'heatpump': 0.15,
    'unknown': 0.385
  };
  const waterHeatingEmissions = 4000 * (waterHeatingFactors[waterHeating] ?? 0.385);

  const acType = answers.homeEnergy?.acUsage ?? 'summer';
  const acConsumption = {
    'none': 0,
    'summer': 1500,
    'yearround': 3000
  };
  const acEmissions = (acConsumption[acType] ?? 1500) * 0.385;

  // Calculate renewable offset
  const renewablePct = Number(answers.homeEnergy?.renewablePercentage ?? 10) || 0;
  // Renewable applies to base electricity, ac usage, and electric water heating
  const electricEmissions = baseElectricity + acEmissions + (waterHeating === 'electric' ? waterHeatingEmissions : 0);
  const renewableOffset = - (renewablePct / 100) * electricEmissions;

  const totalHomeEnergy = Math.max(0, baseElectricity + waterHeatingEmissions + acEmissions + renewableOffset);

  // 3. Diet & Food
  const dietType = answers.food?.dietType ?? 'mixed';
  const baseFoodFactors = {
    'vegan': 1.5,
    'vegetarian': 2.0,
    'mixed': 2.8,
    'meatHeavy': 3.5
  };
  const dailyBase = baseFoodFactors[dietType] ?? 2.8;
  const annualBaseFood = dailyBase * 365;

  const meatDays = Number(answers.food?.meatDaysPerWeek ?? 3) || 0;
  const beefDays = Number(answers.food?.beefOrLambDaysPerWeek ?? 1) || 0;
  // Beef premium
  const beefPremium = beefDays * 52 * 2.0;

  const localFrequency = answers.food?.localOrganicFrequency ?? 'sometimes';
  const localReductions = {
    'rarely': 0,
    'sometimes': 0.1,
    'often': 0.2,
    'usually': 0.35,
    'always': 0.5
  };
  const foodReductionPct = localReductions[localFrequency] ?? 0.1;
  const localOffset = -foodReductionPct * annualBaseFood;

  const totalFood = Math.max(0, annualBaseFood + beefPremium + localOffset);

  // 4. Shopping & Consumption
  const onlineShop = Number(answers.shopping?.onlineShoppingPerMonth ?? 5) || 0;
  const onlineEmissions = onlineShop * 12 * 0.5;

  const fastFashion = Number(answers.shopping?.fastFashionPerMonth ?? 1) || 0;
  const fashionEmissions = fastFashion * 12 * 3.5;

  const electronics = Number(answers.shopping?.electronicsPurchasesPerYear ?? 2) || 0;
  const electronicsEmissions = electronics * 25;

  const totalShopping = onlineEmissions + fashionEmissions + electronicsEmissions;

  // 5. Waste Management
  const wasteKg = Number(answers.waste?.wasteKgPerWeek ?? 15) || 0;
  const baseWaste = wasteKg * 52 * 0.5;

  const recycleFreq = answers.waste?.recyclingFrequency ?? 'regularly';
  const recyclingRates = {
    'never': 0,
    'occasionally': 0.25,
    'regularly': 0.50,
    'always': 0.80
  };
  const recycleOffset = - (recyclingRates[recycleFreq] ?? 0.50) * baseWaste;

  const compostActive = answers.waste?.composting ?? false;
  const compostOffset = compostActive ? -0.15 * baseWaste : 0;

  const plasticLevel = answers.waste?.plasticUsageLevel ?? 'medium';
  const plasticEmissionsMap = {
    'high': 200,
    'medium': 100,
    'low': 30,
    'none': 0
  };
  const plasticEmissions = plasticEmissionsMap[plasticLevel] ?? 100;

  const totalWaste = Math.max(0, baseWaste + recycleOffset + compostOffset + plasticEmissions);

  // Totals
  const totalCO2Kg = totalTransport + totalHomeEnergy + totalFood + totalShopping + totalWaste;
  const totalTonnes = totalCO2Kg / 1000;

  let rating = 'AVERAGE';
  if (totalTonnes <= 2) rating = 'EXCELLENT';
  else if (totalTonnes <= 4) rating = 'GOOD';
  else if (totalTonnes <= 6) rating = 'AVERAGE';
  else if (totalTonnes <= 8) rating = 'HIGH IMPACT';
  else rating = 'CRITICAL';

  // Guard breakdown computation against division by zero
  const breakdown = totalCO2Kg > 0 ? {
    transportation: Number(((totalTransport / totalCO2Kg) * 100).toFixed(1)),
    homeEnergy: Number(((totalHomeEnergy / totalCO2Kg) * 100).toFixed(1)),
    food: Number(((totalFood / totalCO2Kg) * 100).toFixed(1)),
    shopping: Number(((totalShopping / totalCO2Kg) * 100).toFixed(1)),
    waste: Number(((totalWaste / totalCO2Kg) * 100).toFixed(1)),
  } : { transportation: 0, homeEnergy: 0, food: 0, shopping: 0, waste: 0 };

  return {
    transportationCO2: Math.round(totalTransport),
    homeEnergyCO2: Math.round(totalHomeEnergy),
    foodCO2: Math.round(totalFood),
    shoppingCO2: Math.round(totalShopping),
    wasteCO2: Math.round(totalWaste),
    totalCO2: Math.round(totalCO2Kg),
    totalTonnes: Number(totalTonnes.toFixed(2)),
    rating,
    breakdown,
    comparison: {
      userScore: Number(totalTonnes.toFixed(2)),
      countryAverage: 4.8,
      globalAverage: 5.1,
      sustainableTarget: 2.0
    }
  };
};

export const generateInsights = (answers, results) => {
  const insights = [];

  // Insight 1: Flying Impact
  const flightFreq = answers.transportation?.flightFrequency ?? '1-2';
  if (flightFreq !== 'none') {
    const flightEmissions = results.transportationCO2 * 0.15; // approximate reduction potential
    insights.push({
      id: 'flying_impact',
      title: '✈️ Flying Impact',
      message: `You fly more frequently than average. Reducing one round-trip flight could lower your annual footprint by approximately ${Math.round(flightEmissions)} kg CO₂.`,
      category: 'transportation',
      impactPotential: 'high'
    });
  }

  // Insight 2: LED Lights
  if (results.homeEnergyCO2 > 1500) {
    insights.push({
      id: 'led_lights',
      title: '💡 Energy Efficiency',
      message: 'Switching to LED lighting in your home could save approximately 180 kg CO₂ annually at minimal cost.',
      category: 'homeEnergy',
      impactPotential: 'medium'
    });
  }

  // Insight 3: Diet Recognition (positive/neutral)
  const dietType = answers.food?.dietType ?? 'mixed';
  const beefDays = Number(answers.food?.beefOrLambDaysPerWeek ?? 1);
  if (dietType === 'mixed' && beefDays <= 2) {
    insights.push({
      id: 'vegetarian_diet',
      title: '🥗 Diet Recognition',
      message: 'Your mixed diet is more sustainable than 67% of users. Incorporating Meatless Mondays could save an additional 150 kg CO₂/year.',
      category: 'food',
      positive: true,
      impactPotential: 'medium'
    });
  }

  // Insight 4: Public Transit Focus
  const publicTransit = answers.transportation?.publicTransit ?? 'never';
  if (publicTransit === 'never') {
    insights.push({
      id: 'public_transit',
      title: '🚌 Public Transit',
      message: 'Using public transit just 2 days per week instead of driving could reduce your transportation emissions by up to 12%.',
      category: 'transportation',
      impactPotential: 'medium'
    });
  }

  // Insight 5: Renewable energy transition
  const renewable = Number(answers.homeEnergy?.renewablePercentage ?? 10);
  if (renewable < 25) {
    const renewPotential = Math.round(results.homeEnergyCO2 * 0.75);
    insights.push({
      id: 'renewable_energy',
      title: '☀️ Clean Energy Option',
      message: `Switching to 100% renewable electricity could offset your home energy emissions by up to ${renewPotential} kg CO₂/year.`,
      category: 'homeEnergy',
      impactPotential: 'high'
    });
  }

  // Insight 6: Shopping habits
  const onlineShop = Number(answers.shopping?.onlineShoppingPerMonth ?? 5);
  const fastFashion = Number(answers.shopping?.fastFashionPerMonth ?? 1);
  if (onlineShop > 8 || fastFashion > 3) {
    const shoppingSaving = Math.round(results.shoppingCO2 * 0.4);
    insights.push({
      id: 'fast_fashion',
      title: '🛍️ Shopping Consciously',
      message: `Consolidating online orders and avoiding fast fashion could save around ${shoppingSaving} kg CO₂ annually.`,
      category: 'shopping',
      impactPotential: 'medium'
    });
  }

  // Insight 7: Recycling success
  const recycling = answers.waste?.recyclingFrequency ?? 'regularly';
  if (recycling === 'regularly' || recycling === 'always') {
    insights.push({
      id: 'recycling_impact',
      title: '♻️ Recycling Impact',
      message: `Excellent job! Your consistent recycling routine is successfully offsetting your landfill waste emissions by 25% to 50%.`,
      category: 'waste',
      positive: true,
      impactPotential: 'low'
    });
  }

  return insights.slice(0, 7); // Max 7 insights
};

// Estimate savings of toggling specific simulator items
export const SIMULATOR_ACTIONS = [
  { id: 'bike_short_trips', label: 'Use bike for short trips', co2Saved: 420, cost: 'FREE', diff: 'EASY', desc: 'Replace 2 short car trips per week with biking.', moneySaved: 800 },
  { id: 'veg_days', label: 'Eat vegetarian 2x/week', co2Saved: 180, cost: 'FREE', diff: 'EASY', desc: 'Swap meat with plants twice a week.', moneySaved: 250 },
  { id: 'reduce_flights', label: 'Reduce flights by 1/year', co2Saved: 750, cost: 'FREE', diff: 'MEDIUM', desc: 'Opt for train travel or staycations once a year.', moneySaved: 600 },
  { id: 'led_upgrade', label: 'Install LED bulbs', co2Saved: 150, cost: 'LOW', diff: 'EASY', desc: 'Switch 10 high-use bulbs to LED.', moneySaved: 110 },
  { id: 'public_transit_3x', label: 'Use public transit 3x/week', co2Saved: 680, cost: 'LOW', diff: 'MEDIUM', desc: 'Commute via bus/train three days a week.', moneySaved: 400 },
  { id: 'solar_panels', label: 'Install solar panels (5kW)', co2Saved: 2000, cost: 'HIGH', diff: 'ADVANCED', desc: 'Solarize your roof to produce clean power.', moneySaved: 1200 },
  { id: 'electric_vehicle', label: 'Switch to electric vehicle', co2Saved: 1200, cost: 'HIGH', diff: 'ADVANCED', desc: 'Replace internal combustion engine vehicle with EV.', moneySaved: 1500 }
];

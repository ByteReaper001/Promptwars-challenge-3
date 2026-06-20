// LocalStorage persistence utility and mock data initializer
import { calculateEmissions, generateInsights } from './engine';

const DEFAULT_ANSWERS = {
  transportation: {
    carDaysPerWeek: 5,
    carMilesPerDay: 20,
    flightFrequency: '1-2',
    publicTransit: 'occasionally',
    bikeOrWalk: true
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
    reusesItems: true
  }
};

export const initializeDefaultData = (force = false) => {
  try {
    if (force || !localStorage.getItem('user_profile')) {
    const profile = {
      userId: 'user_uuid_carbonpath',
      email: 'john.doe@example.com',
      name: 'John Doe',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      lastUpdated: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true,
        carbonUnit: 'tons',
        currency: 'USD'
      }
    };
      localStorage.setItem('user_profile', JSON.stringify(profile));
    }

    if (force || !localStorage.getItem('carbon_score')) {
    const calculated = calculateEmissions(DEFAULT_ANSWERS);
    const insights = generateInsights(DEFAULT_ANSWERS, calculated);
    
    const carbonScore = {
      scoreId: 'score_uuid_demo',
      calculationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      answers: DEFAULT_ANSWERS,
      results: calculated,
      breakdown: calculated.breakdown,
      comparison: calculated.comparison,
      insights: insights
    };
      localStorage.setItem('carbon_score', JSON.stringify(carbonScore));
    }

    if (force || !localStorage.getItem('action_logs')) {
    const initialLogs = [
      {
        actionId: 'action_1',
        type: 'challenge_completed',
        title: 'Bike to Work Challenge',
        description: 'Completed 5 days of biking instead of driving',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        impact: { co2Saved: 18.5, moneySaved: 12.50 }
      },
      {
        actionId: 'action_2',
        type: 'action_logged',
        title: 'Installed LED bulbs',
        description: 'Upgraded 8 home bulbs to energy-efficient LED light bulbs',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        impact: { co2Saved: 0.5, estimatedAnnual: 180 }
      },
      {
        actionId: 'action_3',
        type: 'action_logged',
        title: 'Logged Meat-Free Monday',
        description: 'Skipped meat consumption for an entire day',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        impact: { co2Saved: 0.8 }
      },
      {
        actionId: 'action_4',
        type: 'action_logged',
        title: 'Updated Travel Plans',
        description: 'Cancelled one short-haul flight in favor of train commute',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        impact: { co2Saved: 750 }
      },
      {
        actionId: 'action_5',
        type: 'action_logged',
        title: 'Created Personal Goal',
        description: 'Established a target to lower carbon score under 6.0 T',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        impact: { co2Saved: 0 }
      }
    ];
      localStorage.setItem('action_logs', JSON.stringify(initialLogs));
    }

    if (force || !localStorage.getItem('user_goals')) {
    const initialGoals = [
      {
        goalId: 'goal_1',
        title: 'Reach 6.0 tons/year by EOY',
        targetScore: 6.0,
        currentScore: 7.4,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(new Date().getFullYear(), 11, 31).toISOString(),
        progress: 60,
        status: 'in_progress'
      },
      {
        goalId: 'goal_2',
        title: 'Bike to work 3x/week',
        targetScore: 3,
        currentScore: 1,
        startDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 33,
        status: 'in_progress'
      }
    ];
      localStorage.setItem('user_goals', JSON.stringify(initialGoals));
    }

    if (force || !localStorage.getItem('active_challenges')) {
    const initialChallenges = [
      {
        challengeId: 'steps_daily',
        name: '10,000 Steps Daily',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        currentProgress: 7, // days completed
        targetProgress: 30,
        rewardXP: 50,
        difficulty: 'Easy',
        category: 'Walk',
        logs: [
          { date: '2026-06-05', stepsLogged: 10500 },
          { date: '2026-06-06', stepsLogged: 11200 },
          { date: '2026-06-07', stepsLogged: 10100 },
          { date: '2026-06-08', stepsLogged: 9800 },
          { date: '2026-06-09', stepsLogged: 12400 },
          { date: '2026-06-10', stepsLogged: 10800 },
          { date: '2026-06-11', stepsLogged: 11000 }
        ]
      },
      {
        challengeId: 'meat_free_mondays',
        name: 'Meat-Free Mondays',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        currentProgress: 8,
        targetProgress: 12,
        rewardXP: 100,
        difficulty: 'Easy',
        category: 'Food',
        expectedImpact: 420,
        logs: []
      },
      {
        challengeId: 'plastic_free',
        name: 'Plastic-Free Week',
        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        currentProgress: 5,
        targetProgress: 7,
        rewardXP: 75,
        difficulty: 'Medium',
        category: 'Waste',
        logs: []
      },
      {
        challengeId: 'transit_commute',
        name: 'Public Transport Focus',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        currentProgress: 16,
        targetProgress: 20,
        rewardXP: 120,
        difficulty: 'Medium',
        category: 'Transit',
        logs: []
      },
      {
        challengeId: 'energy_efficiency',
        name: 'Energy Efficiency Quest',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
        currentProgress: 90, // XP earned
        targetProgress: 140, // Target XP
        rewardXP: 150,
        difficulty: 'Medium',
        category: 'Home',
        tasks: [
          { name: 'Switch to LED bulbs (all rooms)', xp: 30, done: true },
          { name: 'Install smart thermostat', xp: 40, done: true },
          { name: 'Unplug devices when not in use', xp: 20, done: false },
          { name: 'Upgrade to efficient appliances', xp: 50, done: false }
        ]
      }
    ];
      localStorage.setItem('active_challenges', JSON.stringify(initialChallenges));
    }

    if (force || !localStorage.getItem('achievements')) {
    const initialAchievements = [
      {
        badgeId: 'green_beginner',
        name: 'Green Beginner',
        icon: '🌱',
        unlockedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Completed your first carbon assessment',
        tier: 'NOVICE',
        rarity: 'Common'
      },
      {
        badgeId: 'recycling_champ',
        name: 'Recycling Champion',
        icon: '♻️',
        unlockedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Log recycling 10 times in waste management',
        tier: 'NOVICE',
        rarity: 'Common'
      },
      {
        badgeId: 'commuter',
        name: 'Sustainable Commuter',
        icon: '🚲',
        unlockedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Bike 50km in a month instead of driving',
        tier: 'INTERMEDIATE',
        rarity: 'Rare'
      }
    ];
      localStorage.setItem('achievements', JSON.stringify(initialAchievements));
    }

    if (force || !localStorage.getItem('streak_data')) {
      const streak = {
      currentStreak: 14,
      longestStreak: 28,
      lastEcoAction: new Date().toISOString(),
      streakStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    };
      localStorage.setItem('streak_data', JSON.stringify(streak));
    }
  } catch (err) {
    // If localStorage is unavailable or corrupt, clear and retry once
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
  }
};

export const getStorageData = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      initializeDefaultData();
      const retry = localStorage.getItem(key);
      return retry ? JSON.parse(retry) : null;
    }
    return JSON.parse(item);
  } catch (err) {
    // If parse fails or storage is unavailable, reinitialize and return fallback
    try { initializeDefaultData(true); } catch (e) {}
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
};

export const saveStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const cleanupOldLogs = () => {
  const logs = getStorageData('action_logs') || [];
  const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
  const recentLogs = logs.filter(log => new Date(log.date).getTime() > oneYearAgo);
  // Keep max 100 entries
  const cappedLogs = recentLogs.slice(0, 100);
  saveStorageData('action_logs', cappedLogs);
};

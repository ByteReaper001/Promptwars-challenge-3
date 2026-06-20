import React, { useState } from 'react';
import { Settings, User, Bell, Shield, RotateCcw, Check, Sparkles, Moon, Sun } from 'lucide-react';

export default function SettingsTab({ profile, onSaveProfile, onResetData }) {
  const [profileForm, setProfileForm] = useState({
    name: profile.name || 'John Doe',
    email: profile.email || 'john.doe@example.com',
    theme: profile.preferences?.theme || 'light',
    notifications: profile.preferences?.notifications ?? true,
    carbonUnit: profile.preferences?.carbonUnit || 'tons',
    currency: profile.preferences?.currency || 'USD'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: profileForm.name,
      email: profileForm.email,
      lastUpdated: new Date().toISOString(),
      preferences: {
        theme: profileForm.theme,
        notifications: profileForm.notifications,
        carbonUnit: profileForm.carbonUnit,
        currency: profileForm.currency
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleDarkMode = () => {
    const nextTheme = profileForm.theme === 'dark' ? 'light' : 'dark';
    setProfileForm(prev => ({ ...prev, theme: nextTheme }));
    
    // Immediately apply class to document html/body
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to reset all of your CarbonPath data? This will clear all logged actions, streak history, goals, and custom calculator values.')) {
      onResetData();
      alert('Data reset successfully. Scaffolding defaults.');
    }
  };

  return (
    <div className="animate-fade-in py-8 px-4 max-w-3xl mx-auto space-y-8 text-left">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
          ⚙️ Settings & Preferences
        </h2>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Customize your profile, notification targets, theme modes, and manage data parameters.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-3xl p-8 shadow-heavy space-y-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PROFILE CARD */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>User Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="user-name" className="text-xs font-bold text-stone-650 dark:text-zinc-400">Name</label>
                <input
                  id="user-name"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-850 dark:text-zinc-200 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="user-email" className="text-xs font-bold text-stone-650 dark:text-zinc-400 font-semibold">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-250 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-stone-850 dark:text-zinc-200 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-stone-100 dark:border-zinc-800" />

          {/* APPLICATION SETTINGS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-400 dark:text-zinc-550 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              <span>App Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Unit System */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-650 dark:text-zinc-400">Carbon Unit</span>
                <div className="grid grid-cols-2 gap-2">
                  {['tons', 'kg'].map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setProfileForm(prev => ({ ...prev, carbonUnit: u }))}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        profileForm.carbonUnit === u 
                          ? 'border-emerald-600 bg-emerald-50/15 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' 
                          : 'border-stone-200 dark:border-zinc-850 hover:border-stone-300'
                      }`}
                    >
                      {u === 'tons' ? 'Metric Tons' : 'Kilograms (kg)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Settings */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-650 dark:text-zinc-400">Preferred Currency</span>
                <div className="grid grid-cols-2 gap-2">
                  {['USD', 'EUR'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setProfileForm(prev => ({ ...prev, currency: c }))}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        profileForm.currency === c
                          ? 'border-emerald-600 bg-emerald-50/15 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' 
                          : 'border-stone-200 dark:border-zinc-850 hover:border-stone-300'
                      }`}
                    >
                      {c === 'USD' ? 'USD ($)' : 'EUR (€)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Preferences */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-150 dark:border-zinc-850 rounded-2xl col-span-1 sm:col-span-2">
                <div className="space-y-0.5 text-left">
                  <div className="text-sm font-semibold text-stone-700 dark:text-zinc-350">Dark Theme Mode</div>
                  <div className="text-xs text-stone-500 dark:text-zinc-500">Toggle carbon dashboard aesthetics from warm white to deep zinc black.</div>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-all"
                >
                  {profileForm.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-150 dark:border-zinc-850 rounded-2xl col-span-1 sm:col-span-2">
                <div className="space-y-0.5 text-left">
                  <span className="text-sm font-semibold text-stone-700 dark:text-zinc-350 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-stone-400" />
                    Push notifications
                  </span>
                  <div className="text-xs text-stone-500 dark:text-zinc-500">Enable daily checklist highlights and weekly carbon summary updates.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileForm(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={`w-14 h-7.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    profileForm.notifications ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`bg-white dark:bg-zinc-900 w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-300 ${
                    profileForm.notifications ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          <hr className="border-stone-100 dark:border-zinc-800" />

          {/* SUBMIT FORM BUTTON */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-subtle flex items-center gap-1.5"
            >
              <span>Save Preferences</span>
              <Check className="w-4 h-4" />
            </button>
            
            {savedSuccess && (
              <span className="text-xs text-emerald-650 dark:text-emerald-400 font-bold flex items-center gap-1 animate-scale-up">
                <Sparkles className="w-4 h-4" />
                Preferences updated successfully!
              </span>
            )}
          </div>
        </form>

        <hr className="border-stone-100 dark:border-zinc-800" />

        {/* RISK MANAGEMENT / RESET */}
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Danger Zone</span>
          </h3>

          <div className="p-4 border border-red-200 dark:border-red-950/30 rounded-2xl bg-red-50/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-stone-850 dark:text-zinc-200">Reset Local Application Database</div>
              <p className="text-xs text-stone-500 dark:text-zinc-500">Deletes custom challenges logs, carbon histories, and sets initial defaults.</p>
            </div>
            <button
              type="button"
              onClick={handleResetClick}
              className="px-4 py-2.5 bg-red-550 hover:bg-red-650 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-subtle transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Database
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

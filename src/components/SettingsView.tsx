import React, { useState } from 'react';
import { UserSettings, UserProfile } from '../types';
import { LucideIcon } from './LucideIcon';
import { motion } from 'motion/react';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveProfile: (profile: UserProfile) => void;
  onSavePreferences: (settings: Partial<UserSettings>) => void;
  productsCount: number;
  ordersCount: number;
  customersCount: number;
  couponsCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveProfile,
  onSavePreferences,
  productsCount,
  ordersCount,
  customersCount,
  couponsCount,
}) => {
  const [profileForm, setProfileForm] = useState<UserProfile>({ ...settings.profile });
  const [prefs, setPrefs] = useState({
    darkMode: settings.darkMode,
    emailNotif: settings.emailNotif,
    pushNotif: settings.pushNotif,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
  };

  const handleTogglePref = (key: 'darkMode' | 'emailNotif' | 'pushNotif') => {
    const updated = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: updated }));
    onSavePreferences({ [key]: updated });
  };

  const handleSaveAllPrefs = () => {
    onSavePreferences(prefs);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  return (
    <div className="space-y-6 max-w-4xl max-w-full animate-fadein">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Customize your personal profile preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Profile Card Form */}
        <motion.form
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleProfileSubmit}
          className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm"
        >
          <div className="border-b border-gray-50 dark:border-gray-800 pb-3">
            <h2 className="font-bold text-gray-900 dark:text-white text-base">Store Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage operator information credentials</p>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full name</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Full name"
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-xs"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="Email address"
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-xs"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              placeholder="e.g. +1 (555) 012-3344"
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-xs"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Biography</label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Bio description"
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40 shadow-xs resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-full text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-[0.98] transition cursor-pointer shadow-sm text-center"
          >
            Save Profile Changes
          </button>
        </motion.form>

        {/* Preferences side and metrics snapshot */}
        <div className="space-y-6">
          {/* Preferences Settings */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm"
          >
            <div className="border-b border-gray-50 dark:border-gray-800 pb-3">
              <h2 className="font-bold text-gray-900 dark:text-white text-base">Client preferences</h2>
              <p className="text-xs text-gray-400 mt-0.5">Fine-tune application visual environment</p>
            </div>

            <div className="space-y-4">
              {/* Dark mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Dark mode</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Switch the interface to dark mode color settings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.darkMode}
                    onChange={() => handleTogglePref('darkMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-gray-900 dark:peer-checked:bg-[#6366f1] transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Email notifications</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Receive transaction checkout email receipts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.emailNotif}
                    onChange={() => handleTogglePref('emailNotif')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-gray-900 dark:peer-checked:bg-[#6366f1] transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>

              {/* Push notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Push notifications</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Real-time checkout metrics warnings alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.pushNotif}
                    onChange={() => handleTogglePref('pushNotif')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-gray-900 dark:peer-checked:bg-[#6366f1] transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSaveAllPrefs}
              className="w-full px-4 py-3 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 active:scale-[0.98] transition cursor-pointer shadow-xs text-center mt-2 block"
            >
              Save Preferences
            </button>
          </motion.div>

          {/* Store snapshot */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-[#15171c] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-3 shadow-sm"
          >
            <div>
              <h2 className="font-bold text-gray-950 dark:text-white text-base">Store snapshot</h2>
              <p className="text-xs text-gray-400 mt-0.5">Quick look at operational inventory count statistics</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center pt-1.5">
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
                <p className="font-black text-gray-900 dark:text-white text-lg">{productsCount}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Products</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
                <p className="font-black text-gray-900 dark:text-white text-lg">{ordersCount}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Orders</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
                <p className="font-black text-gray-900 dark:text-white text-lg">{customersCount}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Customers</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100/50 dark:border-gray-800/10">
                <p className="font-black text-gray-900 dark:text-white text-lg">{couponsCount}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Coupons</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

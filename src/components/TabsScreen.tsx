import React, { useState } from 'react';
import { BarChart3, Clock, Trophy, Shield, Database, Users, Server, Eye, Sparkles, User, Settings, CreditCard, HelpCircle, CheckCircle, BellRing, Lock, ToggleLeft, ToggleRight, Laptop, Moon, Sun, AlertCircle } from 'lucide-react';
import { UserProfile, UserSettings } from '../types';
import { XPBadge, StreakBadge } from './Badges';

interface AnalyticsViewProps {
  profile: UserProfile;
}

export function AnalyticsView({ profile }: AnalyticsViewProps) {
  // SVG drawing dimensions for consistency chart
  const weeklyHours = [3.2, 4.8, 1.5, 6.2, 5.0, 2.8, 4.0];
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxHour = 8;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Progress & Analytics</h2>
          <p className="text-xs text-zinc-400">Audit your skill consistency and learning velocity logs.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-white/5 text-[10px] text-zinc-400 font-mono font-bold">
          <span>Current Study Level: {profile.level}</span>
        </div>
      </div>

      {/* Primary Analytics Grid metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly hours studied bar charts custom built in SVG */}
        <div className="p-5 rounded-3xl bg-[#111111] border border-white/5 shadow-sm flex flex-col justify-between col-span-1 md:col-span-2">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="font-display font-semibold text-sm text-white">Weekly Study Consistency</h4>
              <p className="text-[10px] text-zinc-500">Daily hours dedicated to syllabus exercises</p>
            </div>
            <span className="text-xs font-bold text-purple-400 font-mono">Tot: {profile.hoursStudied} hrs worked</span>
          </div>

          {/* SVG Visual bar drawings */}
          <div className="h-44 flex items-end justify-between gap-2.5 pt-4 px-2">
            {weeklyHours.map((hours, index) => {
              const pct = (hours / maxHour) * 100;
              return (
                <div key={weekdays[index]} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full flex justify-center">
                    {/* Hover tooltip label */}
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-[#0A0A0A] border border-white/5 text-[9px] text-zinc-300 font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap">
                      {hours} hrs
                    </span>
                    {/* Rounded status bar */}
                    <div className="w-full sm:w-6 h-32 bg-[#0A0A0A] group-hover:bg-[#111111] rounded-xl border border-white/5 overflow-hidden flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-blue-655 rounded-sm transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 group-hover:text-zinc-200 font-semibold font-mono">{weekdays[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Consistency Score wheel */}
        <div className="p-5 rounded-3xl bg-[#111111] border border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Platform learning score</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Calculated based on streaks & speed answers</p>
          </div>

          <div className="my-4 flex items-center justify-center relative">
            {/* Simple concentric SVG indicator */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="45" className="stroke-[#0A0A0A]" strokeWidth="6" fill="none" />
              <circle cx="56" cy="56" r="45" className="stroke-purple-500" strokeWidth="6" strokeDasharray="282" strokeDashoffset="70" strokeLinecap="round" fill="none" />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-white font-display">84%</span>
              <span className="block text-[8px] font-bold text-zinc-500 tracking-wider">Mastery Index</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400">
              Your streak is <strong className="text-amber-500">{profile.streak} days</strong> strong. Keep learning each day to unlock legendary achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced performance analytics widgets */}
      <div className="p-5 rounded-3xl bg-[#111111] border border-white/5 shadow-sm">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Syllabus Complete Speed Indices</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Monthly Practice Hours Goal</span>
                <span className="font-mono text-zinc-200">24.5 / 45 hrs Completion</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '54.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Assessments Verified</span>
                <span className="font-mono text-zinc-200">14 / 20 steps done</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-blue-550 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Quiz accuracy</span>
                <span className="font-mono text-zinc-200">92% Average score</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-zinc-400 font-medium">Coding compilation accuracy</span>
                <span className="font-mono text-zinc-200">85% compile pass rate</span>
              </div>
              <div className="w-full h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProfileViewProps {
  profile: UserProfile;
  settings: UserSettings;
  onUpdateSettings: (set: Partial<UserSettings>) => void;
  onUpdateProfile: (num: any) => void;
  onTriggerCheckout: () => void;
  checkoutStatus: string | null;
}

export function ProfileView({
  profile,
  settings,
  onUpdateSettings,
  onUpdateProfile,
  onTriggerCheckout,
  checkoutStatus
}: ProfileViewProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(settings.notificationsEnabled);
  const [isSyncingTheme, setIsSyncingTheme] = useState(settings.theme);

  const handleUpdate = (updates: any) => {
    onUpdateSettings(updates);
  };

  const selectColorTheme = (theme: 'dark' | 'light' | 'system') => {
    setIsSyncingTheme(theme);
    onUpdateSettings({ theme });
  };

  return (
    <div className="space-y-6">
      {/* 1. Primary info card */}
      <div className="p-6 rounded-3xl bg-[#111111] border border-white/5 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex items-center flex-col md:flex-row gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 shadow-md">
            <img src={profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-col md:flex-row">
              <h3 className="font-display font-bold text-lg text-white">{profile.name}</h3>
              <span className="text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-xl bg-[#0A0A0A] border border-white/5 text-purple-400">
                {profile.isPro ? 'Pro Subscription' : 'Free Tier'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{profile.email}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-2">Account active since {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-right">
          <div className="flex gap-2.5">
            <StreakBadge days={profile.streak} />
            <div className="px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/20 text-xs text-purple-400 font-bold">
              Level {profile.level}
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Platform Score: {profile.xp} XP total</p>
        </div>
      </div>

      {/* Grid Settings detail panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings preference form list */}
        <div className="p-5 rounded-3xl bg-[#111111] border border-white/5 shadow-sm space-y-4">
          <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
            <Settings className="w-4.5 h-4.5 text-purple-400" />
            <span>Preferences Menu</span>
          </h4>

          {/* Theme custom selector */}
          <div className="space-y-1.5 border-b border-white/5 pb-3">
            <span className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">Theme Mode</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'light', label: 'Light Mode', icon: Sun },
                { id: 'system', label: 'System Defaults', icon: Laptop }
              ].map((t) => {
                const IconComponent = t.icon;
                const isSelected = isSyncingTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectColorTheme(t.id as any)}
                    className={`p-2 rounded-xl text-xs font-semibold gap-1.5 flex flex-col items-center justify-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-sm'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs cursor-pointer" onClick={() => {
              const nextVal = !settings.emailNotifications;
              onUpdateSettings({ emailNotifications: nextVal });
            }}>
              <div>
                <span className="block font-semibold text-zinc-200">Email Alerts</span>
                <span className="block text-[10px] text-zinc-500">Receive weekly personalized progress recommendation graphs</span>
              </div>
              <button className="text-purple-400 cursor-pointer">
                {settings.emailNotifications ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-zinc-600" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs cursor-pointer" onClick={() => {
              const nextVal = !settings.pushNotifications;
              onUpdateSettings({ pushNotifications: nextVal });
            }}>
              <div>
                <span className="block font-semibold text-zinc-200">Push Notifications</span>
                <span className="block text-[10px] text-zinc-500">Instant notification when AI Mentor replies to prompts</span>
              </div>
              <button className="text-purple-400 cursor-pointer">
                {settings.pushNotifications ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-zinc-650" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs cursor-pointer" onClick={() => {
              const nextVal = !settings.privacyPublicProfile;
              onUpdateSettings({ privacyPublicProfile: nextVal });
            }}>
              <div>
                <span className="block font-semibold text-zinc-205">Share profile publicly</span>
                <span className="block text-[10px] text-zinc-500">Show performance logs on school leaderboards</span>
              </div>
              <button className="text-purple-400 cursor-pointer">
                {settings.privacyPublicProfile ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-zinc-650" />}
              </button>
            </div>
          </div>
        </div>

        {/* Subscription stripe payment mock screen */}
        <div className="p-5 rounded-3xl bg-[#111111] border border-white/5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <CreditCard className="w-4.5 h-4.5 text-purple-400" />
              <span>Payments & Subscriptions</span>
            </h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Secure payments managed by Stripe & Razorpay portals.</p>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/10 bg-purple-500/5 shadow-sm space-y-2 text-xs">
            <div className="flex justify-between items-center bg-transparent">
              <span className="font-bold text-purple-300">LearnPath AI Pro Special Code</span>
              <span className="text-[10px] text-zinc-400 font-mono font-bold">$12.99 / Month</span>
            </div>
            <ul className="space-y-1 text-[10px] text-zinc-500 leading-relaxed list-none pl-0">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-purple-400" />
                <span>Unlimited server-side AI Mentor chats</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-purple-400" />
                <span>Unlimited multi-phase roadmap trees</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-purple-400" />
                <span>Advanced personalized code execution analysis</span>
              </li>
            </ul>
          </div>

          {checkoutStatus ? (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold">{checkoutStatus}</p>
                <p className="text-[10px] text-zinc-500 font-medium">Auto-activated on bypassed premium demo profiles.</p>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={onTriggerCheckout}
                disabled={profile.isPro}
                className="w-full py-2.5 font-bold text-xs text-white bg-[#111111] hover:bg-zinc-850 rounded-xl hover:text-white border border-white/5 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                id="btn-stripe-checkout"
              >
                {profile.isPro ? 'Verified Pro Member' : 'Trigger Stripe Premium Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AdminViewProps {
  onSeedRoadmap: () => void;
  onClearCache: () => void;
  apiCallsCounter: number;
}

export function AdminView({ onSeedRoadmap, onClearCache, apiCallsCounter }: AdminViewProps) {
  const [activeTabAdmin, setActiveTabAdmin] = useState<'users' | 'templates' | 'diagnostics'>('diagnostics');

  const mockedTraffic = [
    { endpoint: '/api/generate-roadmap', traffic: 124, status: '200 OK' },
    { endpoint: '/api/mentor-chat', traffic: 245, status: '200 OK' },
    { endpoint: '/api/analyze-code', traffic: 89, status: '200 OK' },
    { endpoint: '/api/ai-recommendations', traffic: 322, status: '304 Not Modified' }
  ];

  const adminUsers = [
    { email: 'user.demo@learnpath.ai', streak: 5, xp: 1840, date: 'June 15, 2026', isPro: false },
    { email: 'sarah.connor@openai-skynet.com', streak: 42, xp: 12900, date: 'May 04, 2026', isPro: true },
    { email: 'linus.torvalds@kernel-ops.org', streak: 125, xp: 45200, date: 'Jan 12, 2026', isPro: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Central Operations Console</h2>
          <p className="text-xs text-zinc-400">Review backend data, traffic metrics, and sandbox templates.</p>
        </div>

        {/* Horizontal tabs */}
        <div className="flex gap-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
          {[
            { id: 'diagnostics', label: 'Systems Diagnostics', icon: Server },
            { id: 'users', label: 'User Indexes', icon: Users },
            { id: 'templates', label: 'Curriculums', icon: Database }
          ].map((sc) => {
            const Icon = sc.icon;
            const isSel = activeTabAdmin === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveTabAdmin(sc.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  isSel ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTabAdmin === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Gemini API Operations Counter</span>
              <span className="text-3xl font-extrabold text-violet-400 font-display mt-2">{apiCallsCounter} calls</span>
              <span className="text-[9px] text-zinc-500 mt-1 font-mono">Resilient caching active.</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Server Operational Load</span>
              <span className="text-3xl font-extrabold text-blue-400 font-display mt-2">0.05s response</span>
              <span className="text-[9px] text-zinc-500 mt-1 font-mono">Cloud Run container ping metrics standard.</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Storage engine integrity</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-display mt-2">100% active</span>
              <span className="text-[9px] text-zinc-550 mt-1 font-mono">Bypassed JWT state persistence intact.</span>
            </div>
          </div>

          {/* Traffic tables list */}
          <div className="p-5 rounded-2xl bg-[#171717] border border-zinc-850 shadow-sm">
            <h4 className="font-display font-semibold text-sm text-white mb-3">Live API Traffic Loggers</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-2.5">Endpoint Pattern</th>
                    <th className="pb-2.5">Invocations Counter</th>
                    <th className="pb-2.5">Access status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {mockedTraffic.map((tr) => (
                    <tr key={tr.endpoint}>
                      <td className="py-3 font-mono font-bold text-zinc-300">{tr.endpoint}</td>
                      <td className="py-3 font-mono text-zinc-200">{tr.traffic} calls</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                          {tr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTabAdmin === 'users' && (
        <div className="p-5 rounded-2xl bg-[#171717] border border-zinc-850 shadow-sm">
          <h4 className="font-display font-semibold text-sm text-white mb-3">Auditing User records</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="pb-2.5">Registry Email</th>
                  <th className="pb-2.5">Day Streak</th>
                  <th className="pb-2.5">Acquired XP</th>
                  <th className="pb-2.5">Subscription Tier</th>
                  <th className="pb-2.5">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {adminUsers.map((usr) => (
                  <tr key={usr.email}>
                    <td className="py-3 font-semibold text-zinc-250">{usr.email}</td>
                    <td className="py-3 font-mono text-amber-500">{usr.streak} days</td>
                    <td className="py-3 font-bold text-violet-400">+{usr.xp} XP</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        usr.isPro ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-zinc-800 text-zinc-450 border border-zinc-750'
                      }`}>
                        {usr.isPro ? 'PRO MEMBER' : 'FREE BASIC'}
                      </span>
                    </td>
                    <td className="py-3 text-[10px] text-zinc-500">{usr.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTabAdmin === 'templates' && (
        <div className="p-5 rounded-2xl bg-[#171717] border border-[#1d1d1d] shadow-sm space-y-4">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Syllabus Template Controls</h4>
            <p className="text-xs text-zinc-400">Perform maintenance commands on school curriculum caches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onSeedRoadmap}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 text-left cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-violet-400" />
                <span className="font-bold text-xs text-white">Inject Preset NumPy Lesson Seed</span>
              </div>
              <p className="text-[10px] text-zinc-500">Adds an advanced interactive programming chapter directly to the active roadmap node list.</p>
            </button>

            <button
              onClick={onClearCache}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 text-left cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                <span className="font-bold text-xs text-rose-450">Purge Curriculum Cache</span>
              </div>
              <p className="text-[10px] text-zinc-500 bg-transparent">Flushes the localStorage memory context, restoring the profile details block back to clean, default seed standards.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

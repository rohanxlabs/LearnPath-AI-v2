import React, { useState } from 'react';
import { Home, Compass, MessageSquare, BarChart3, User, Menu, X, Bell, Flame, Crown, LogOut, Settings, Award, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { UserProfile, SystemNotification } from '../types';
import { StreakBadge, TierBadge } from './Badges';

interface MobileHeaderProps {
  profile: UserProfile;
  notifications: SystemNotification[];
  onTabChange: (tab: string) => void;
  onNotificationsClick: () => void;
  onUpgradeClick: () => void;
  onOpenDrawer: () => void;
}

export function MobileHeader({
  profile,
  notifications,
  onTabChange,
  onNotificationsClick,
  onUpgradeClick,
  onOpenDrawer
}: MobileHeaderProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-[#111111]/80 backdrop-blur-md border-b border-white/5 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className="p-2 -ml-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Open sidebar"
          id="btn-nav-sidebar"
        >
          <Menu className="w-5 h-5 text-zinc-300" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            LearnPath <span className="text-purple-400">AI</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:inline-flex">
          <StreakBadge days={profile.streak} />
        </div>

        <button
          onClick={onNotificationsClick}
          className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          aria-label="View notifications"
          id="btn-nav-notif"
        >
          <Bell className="w-5 h-5 text-zinc-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-purple-500 transition-all duration-200 flex-shrink-0"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'roadmaps', label: 'Roadmaps', icon: Compass },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 border-t border-white/5 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-purple-400 font-medium scale-105'
                  : 'text-zinc-500 hover:text-zinc-350'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'stroke-[2px]'}`} />
              <span className="text-[10px] tracking-wide font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: UserProfile;
  onUpgradeClick: () => void;
  onLogoutClick: () => void;
}

export function SideDrawer({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  profile,
  onUpgradeClick,
  onLogoutClick
}: SideDrawerProps) {
  const sections = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'roadmaps', label: 'Roadmaps', icon: Compass },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
    { id: 'progress', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#111111] text-white shadow-2xl flex flex-col transition-transform duration-300 border-r border-white/10">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              LearnPath <span className="text-purple-400">AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-zinc-400 hover:text-white" />
          </button>
        </div>

        {/* Profile preview summary */}
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <img src={profile.avatar} alt="Profile photo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{profile.name}</p>
              <p className="text-xs text-zinc-400 truncate">{profile.email}</p>
            </div>
          </div>
          <div className="mt-3.5 flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              Level <span className="font-bold text-white text-xs bg-white/5 border border-white/10 px-1.5 py-0.5 rounded ml-1">{profile.level}</span>
            </div>
            <TierBadge isPro={profile.isPro} onClick={onUpgradeClick} />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  onTabChange(sec.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/5 text-purple-400 border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Upgrade Card Banner */}
        {!profile.isPro && (
          <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-purple-400" />
              <h5 className="text-xs font-bold text-purple-300">UPGRADE TO PRO</h5>
            </div>
            <p className="text-[10px] text-zinc-300 leading-relaxed mb-3">
              Unlock unlimited AI dynamic roadmaps, instant code analysis, and continuous mock assessments.
            </p>
            <button
              onClick={() => {
                onUpgradeClick();
                onClose();
              }}
              className="w-full py-1.5 font-bold text-xs rounded-lg text-center bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Get Unlimited Access
            </button>
          </div>
        )}

        {/* Drawer footer buttons */}
        <div className="p-4 border-t border-zinc-800 space-y-1">
          <button
            onClick={() => {
              onTabChange('profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg text-left"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-500" />
            <span>Settings Preferences</span>
          </button>
          <button
            onClick={() => {
              onLogoutClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-450 hover:text-white hover:bg-rose-500/10 rounded-lg text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-red-400">Bypass Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

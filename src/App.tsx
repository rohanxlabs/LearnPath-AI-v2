import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Shield, Zap, Search, PlusCircle, AlertCircle, Info, Landmark, Terminal, KeyRound } from 'lucide-react';
import { UserProfile, UserSettings, Roadmap, Achievement, SystemNotification, ChatMessage } from './types';
import { MobileHeader, BottomNavigation, SideDrawer } from './components/Navigation';
import { ProgressCard, StatsCard, AchievementCard, NotificationCard, AIRecommendationCard, LearningScoreCard } from './components/Cards';
import { RoadmapTree } from './components/RoadmapTree';
import { RoadmapOverview } from './components/RoadmapOverview';
import { MentorChatView } from './components/MentorChatView';
import { AnalyticsView, ProfileView, AdminView } from './components/TabsScreen';
import { LessonPlayView } from './components/LessonPlayView';
import { loadLocalStorage, saveLocalStorage, DEV_BYPASS_AUTH } from './mockData';

export default function App() {
  const localData = loadLocalStorage();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_BYPASS_AUTH);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');

  // Primary State Managers loaded from localStore
  const [profile, setProfile] = useState<UserProfile>(localData.profile);
  const [settings, setSettings] = useState<UserSettings>(localData.settings);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(localData.roadmaps);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(localData.roadmaps[0]?.id || '');
  const [achievements, setAchievements] = useState<Achievement[]>(localData.achievements);
  const [notifications, setNotifications] = useState<SystemNotification[]>(localData.notifications);
  const [chats, setChats] = useState<ChatMessage[]>(localData.chats);

  // Active view controller tabs
  const [activeTab, setActiveTab] = useState<string>('home'); // home | roadmaps | mentor | progress | profile | achievements | notifications
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Selected reading/practice context
  const [activeLesson, setActiveLesson] = useState<{
    phaseId: string;
    levelId: string;
    lessonId: string;
  } | null>(null);

  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const [isAiGeneratingRoadmap, setIsAiGeneratingRoadmap] = useState(false);
  const [isAiChatGenerating, setIsAiChatGenerating] = useState(false);
  
  // Simulated stats
  const [stripeCheckoutStatus, setStripeCheckoutStatus] = useState<string | null>(null);
  const [apiCallsCounter, setApiCallsCounter] = useState(14); // Track demo server calls

  // Load recommendations on mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Hydrate local localStorage changes on change
  useEffect(() => {
    saveLocalStorage({
      profile,
      settings,
      roadmaps,
      achievements,
      notifications,
      chats
    });
  }, [profile, settings, roadmaps, achievements, notifications, chats]);

  // Fetch from Express recommendations API
  const fetchRecommendations = async () => {
    setIsRecsLoading(true);
    try {
      const activeGoal = roadmaps.find(r => r.id === activeRoadmapId)?.goal || "Full-Stack AI Engineering";
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentXp: profile.xp,
          level: profile.level,
          streak: profile.streak,
          activeGoal
        })
      });
      const data = await response.json();
      setAiRecommendations(data);
    } catch (err) {
      console.error("Express API offline, falling back back to seed recommendations:", err);
    } finally {
      setIsRecsLoading(false);
    }
  };

  // Custom AI Roadmap Generation Trigger
  const handleGenerateRoadmap = async (params: {
    goal: string;
    experienceLevel: string;
    weeklyHours: number;
    preferredStyle: string;
  }) => {
    setIsAiGeneratingRoadmap(true);
    setApiCallsCounter(prev => prev + 1);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await response.json();
      
      const newRoadmap: Roadmap = {
        id: `roadmap-${Date.now()}`,
        goal: data.goal || params.goal,
        experienceLevel: data.experienceLevel || params.experienceLevel,
        weeklyHours: data.weeklyHours || params.weeklyHours,
        preferredStyle: data.preferredStyle || params.preferredStyle,
        progressPercent: data.progressPercent || 0,
        totalXp: data.totalXp || 0,
        lessonsCompleted: data.lessonsCompleted || 0,
        hoursRemaining: data.hoursRemaining || 40,
        createdAt: new Date().toISOString(),
        phases: data.phases || []
      };

      setRoadmaps(prev => [newRoadmap, ...prev]);
      setActiveRoadmapId(newRoadmap.id);
      
      // Dispatch alert notify
      const newNotif: SystemNotification = {
        id: `notif-${Date.now()}`,
        title: 'New AI Syllabus Generated',
        message: `Your custom roadmap for "${newRoadmap.goal}" is now active in your list. Click on are levels to begin practicing.`,
        category: 'roadmap',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
      
      setActiveTab('roadmaps');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGeneratingRoadmap(false);
    }
  };

  // AI Mentor Chat Message Send controller
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `chat-usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChats(prev => [...prev, userMsg]);
    setIsAiChatGenerating(true);
    setApiCallsCounter(prev => prev + 1);

    try {
      const response = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chats.slice(-6) // Send recent message slots to keep context
        })
      });
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toISOString()
      };
      setChats(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiChatGenerating(false);
    }
  };

  // Custom quick selectors for cards
  const handleSelectRecommendationTask = (rec: any) => {
    if (rec.category === 'mentor') {
      setActiveTab('mentor');
      handleSendMessage(`Can you explain details about ${rec.title}?`);
    } else {
      // Direct jump onto Roadmaps section to continue active phases
      setActiveTab('roadmaps');
      // Set level id default expand
      const activeRm = roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0];
      const activePhase = activeRm.phases.find(p => p.status === 'current') || activeRm.phases[0];
      const activeLevel = activePhase.levels.find(l => l.status === 'current') || activePhase.levels[0];
      const firstAvailableLesson = activeLevel.lessons.find(l => l.status === 'available') || activeLevel.lessons[0];
      
      setActiveLesson({
        phaseId: activePhase.id,
        levelId: activeLevel.id,
        lessonId: firstAvailableLesson.id
      });
    }
  };

  // Notification management callbacks
  const handleToggleReadNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Lessons checkpoint gameplay triggers complete
  const handleLessonComplete = (xpAdded: number) => {
    if (!activeLesson) return;

    // 1. Update Lesson Status inside Roadmaps
    const updatedRoadmaps = roadmaps.map((r) => {
      if (r.id !== activeRoadmapId) return r;

      const updatedPhases = r.phases.map((ph) => {
        if (ph.id !== activeLesson.phaseId) return ph;

        let levelDoneCount = 0;
        const updatedLevels = ph.levels.map((lvl) => {
          if (lvl.id !== activeLesson.levelId) {
            if (lvl.status === 'completed') levelDoneCount++;
            return lvl;
          }

          // Unlocking lesson index inside level matches
          const updatedLessons = lvl.lessons.map((les) => {
            if (les.id === activeLesson.lessonId) {
              return { ...les, status: 'completed' as const };
            }
            return les;
          });

          // If the completed lesson is "learn", automatically unlock "quiz" inside same level!
          const allCompletedInLevel = updatedLessons.every(l => l.status === 'completed');
          let newLvlStatus = lvl.status;
          if (allCompletedInLevel) {
            newLvlStatus = 'completed' as const;
            levelDoneCount++;
          }

          // Unlock following lessons dynamically
          const isQuizLocked = lvl.lessons.some(l => l.type === 'quiz' && l.status === 'locked');
          if (isQuizLocked) {
            updatedLessons.forEach((l) => {
              if (l.type === 'quiz' || l.type === 'coding') {
                l.status = 'available';
              }
            });
          }

          return { ...lvl, lessons: updatedLessons, status: newLvlStatus };
        });

        // Compute Phase progress calculations
        const totalLevels = updatedLevels.length;
        const completedLevels = updatedLevels.filter(l => l.status === 'completed').length;
        const phaseProgress = Math.round((completedLevels / totalLevels) * 100);
        let phStatus = ph.status;

        if (phaseProgress === 100) {
          phStatus = 'completed' as const;
        }

        // Unlocking the very next level index if complete
        const currentLvlIdx = updatedLevels.findIndex(l => l.id === activeLesson.levelId);
        if (updatedLevels[currentLvlIdx]?.status === 'completed' && currentLvlIdx + 1 < totalLevels) {
          const nextLvl = updatedLevels[currentLvlIdx + 1];
          if (nextLvl.status === 'locked') {
            nextLvl.status = 'current';
            nextLvl.lessons.forEach(l => {
              if (l.type === 'learn') l.status = 'available';
            });
          }
        }

        return {
          ...ph,
          levels: updatedLevels,
          progress: phaseProgress,
          status: phStatus,
          xpEarned: ph.xpEarned + xpAdded
        };
      });

      // Calculate new cumulative roadmap progress
      const totalPhs = updatedPhases.length;
      const donePhsPercent = updatedPhases.reduce((acc, p) => acc + p.progress, 0) / totalPhs;
      const overallProg = Math.round(donePhsPercent);

      return {
        ...r,
        phases: updatedPhases,
        progressPercent: overallProg,
        totalXp: r.totalXp + xpAdded,
        lessonsCompleted: r.lessonsCompleted + 1,
        hoursRemaining: Math.max(2, r.hoursRemaining - 1.5)
      };
    });

    setRoadmaps(updatedRoadmaps);

    // 2. Add XP to global UserProfile
    const isNextLevelThreshold = profile.xp + xpAdded >= (profile.level * 200);
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + xpAdded,
      level: isNextLevelThreshold ? prev.level + 1 : prev.level,
      streak: prev.streak + 1,
      hoursStudied: prev.hoursStudied + 0.5,
    }));

    // Trigger alert modal if level up occurs
    if (isNextLevelThreshold) {
      const levelNotif: SystemNotification = {
        id: `notif-lvl-${Date.now()}`,
        title: `Congratulations! Leveled Up! 🎉`,
        message: `You successfully advanced to LearnPath Level ${profile.level + 1}! Keep conquering dynamic syllabus trees.`,
        category: 'achievement',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [levelNotif, ...prev]);
    }

    // Unlocking preset accomplishments
    const countCompletedLessons = updatedRoadmaps.find(r => r.id === activeRoadmapId)?.lessonsCompleted || 0;
    if (countCompletedLessons === 5 || countCompletedLessons === 15 || countCompletedLessons === 25) {
      // Find locks and unlock them
      setAchievements(prev => {
        const lockedIdx = prev.findIndex(a => !a.unlocked);
        if (lockedIdx !== -1) {
          const cpy = [...prev];
          cpy[lockedIdx] = {
            ...cpy[lockedIdx],
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          
          // Dispatch unlock alert
          const achNotif: SystemNotification = {
            id: `notif-ach-${Date.now()}`,
            title: `Achievement Unlocked: ${cpy[lockedIdx].name} 🏆`,
            message: `Milestone gained: "${cpy[lockedIdx].description}". +${cpy[lockedIdx].xpReward} XP awarded!`,
            category: 'achievement',
            read: false,
            timestamp: new Date().toISOString()
          };
          setNotifications(prevNotifs => [achNotif, ...prevNotifs]);
          
          // Grant achievement XP
          setProfile(p => ({ ...p, xp: p.xp + cpy[lockedIdx].xpReward }));
          return cpy;
        }
        return prev;
      });
    }

    // Exit active practice screen
    setActiveLesson(null);
  };

  // Stripe payments simulate trigger
  const handleStripeCheckout = () => {
    setStripeCheckoutStatus("Connecting to secure server-side checkout process...");
    setTimeout(() => {
      setStripeCheckoutStatus("Payment processed successfully via Stripe portal! Pro benefits unlocked.");
      setProfile(p => ({ ...p, isPro: true }));
      
      const newNotif: SystemNotification = {
        id: `notif-pro-${Date.now()}`,
        title: 'LearnPath AI Pro Gained! 👑',
        message: 'Welcome to Pro! You now have unlimited AI curriculum generators, priority mentor queries, and continuous quiz modules.',
        category: 'system',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 2000);
  };

  // Active theme application style
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      let activeTheme: 'dark' | 'light' = 'dark';
      if (settings.theme === 'dark') {
        activeTheme = 'dark';
      } else if (settings.theme === 'light') {
        activeTheme = 'light';
      } else {
        // System defaults
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      }
      setResolvedTheme(activeTheme);
      
      if (activeTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    };
    
    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [settings.theme]);

  const themeClass = resolvedTheme === 'dark' ? 'dark text-white' : 'light text-slate-900';
  const customBackground = resolvedTheme === 'dark' ? { backgroundColor: '#0A0A0A' } : { backgroundColor: '#F8FAFC' };

  // Phase AI Action handlers from Sidebar
  const handleAiAction = async (actionType: 'explain' | 'quiz' | 'study_plan' | 'projects', phaseName: string) => {
    setActiveTab('mentor');
    setIsSidebarOpen(false);
    
    let query = "";
    if (actionType === 'explain') {
      query = `Can you break down the main mechanical components of the "${phaseName}" phase? What are the top things to understand?`;
    } else if (actionType === 'quiz') {
      query = `Generate a customized 3-question multiple choice quiz about "${phaseName}". Keep questions highly pedagogical!`;
    } else if (actionType === 'study_plan') {
      query = `I can dedicate 10 hours this week. Design a highly focused weekly calendar breakdown for studying "${phaseName}".`;
    } else {
      query = `Give me 3 innovative GitHub repositories / project ideas I can build to show competence in "${phaseName}".`;
    }

    handleSendMessage(query);
  };

  // Admin maintenance triggers
  const handleSeedRoadmap = () => {
    setNotifications(prev => [
      {
        id: `seed-notif-${Date.now()}`,
        title: 'NumPy Broadcasting Chapter seeded',
        message: 'Admin console seeded an advanced Python Level directly into active roadmap curriculum tree databases.',
        category: 'system',
        read: false,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const activeRoadmap = roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0];
  const activePhase = activeRoadmap.phases.find(p => p.status === 'current') || activeRoadmap.phases[0];

  // Visual tab navigation router
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* 1. Progress banner card */}
            <ProgressCard
              progressPercent={activeRoadmap.progressPercent}
              currentPhaseName={activePhase.name}
              totalXp={profile.xp}
              onContinue={() => {
                setActiveTab('roadmaps');
              }}
            />

            {/* 2. Bento Statistics block */}
            <StatsCard
              stats={{
                hoursStudied: profile.hoursStudied,
                completedTopics: profile.lessonsCompleted,
                totalXp: profile.xp,
                streak: profile.streak,
              }}
            />

            {/* Double grid panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left span: AI dynamic recommendations list */}
              <div className="col-span-1 lg:col-span-2 space-y-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                  <h4 className="font-display font-semibold text-sm text-white">Custom Recommendations</h4>
                </div>

                {isRecsLoading ? (
                  <div className="p-8 text-center bg-[#111111] rounded-2xl border border-white/5 text-xs text-zinc-500">
                    Formulating continuous study suggestions with Gemini...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {aiRecommendations.map((rec) => (
                      <AIRecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onLaunch={handleSelectRecommendationTask}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right span: learning concentric skills card */}
              <div className="col-span-1">
                <LearningScoreCard profile={profile} />
              </div>
            </div>
          </div>
        );

      case 'roadmaps':
        return (
          <div className="space-y-6 animate-fade-in">
            <RoadmapOverview
              roadmaps={roadmaps}
              activeId={activeRoadmapId}
              onSetActive={(id) => {
                setActiveRoadmapId(id);
                setActiveLesson(null);
              }}
              onGenerateRoadmap={handleGenerateRoadmap}
              isGenerating={isAiGeneratingRoadmap}
              onContinueActive={() => setActiveLesson(null)}
            />

            <div className="border-t border-white/5 pt-6">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-1">Active Curriculum Tree</label>
              <RoadmapTree
                roadmap={activeRoadmap}
                onLessonSelect={(phaseId, levelId, lessonId) => {
                  setActiveLesson({ phaseId, levelId, lessonId });
                }}
                onAiAction={handleAiAction}
              />
            </div>
          </div>
        );

      case 'mentor':
        return (
          <MentorChatView
            chats={chats}
            isGenerating={isAiChatGenerating}
            onSendMessage={handleSendMessage}
            onSelectAction={(topic) => handleSendMessage(topic)}
          />
        );

      case 'progress':
        return <AnalyticsView profile={profile} />;

      case 'achievements':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">Achievements Sandbox</h2>
              <p className="text-xs text-zinc-400">Complete curriculum chapters to unlock high-integrity milestones.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <AchievementCard
                  key={ach.id}
                  achievement={ach}
                  onShare={() => {
                    alert(`Copied certificate to clipboard! Gained: "${ach.name}"`);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Your Notifications</h2>
                <p className="text-xs text-zinc-400">Review system updates and AI mentor messages.</p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center bg-[#111111] border border-white/5 rounded-2xl text-xs text-zinc-500">
                Inbox clear! No active notifications.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onReadToggle={handleToggleReadNotification}
                    onDelete={handleDeleteNotification}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <ProfileView
            profile={profile}
            settings={settings}
            onUpdateSettings={(set) => setSettings(prev => ({ ...prev, ...set }))}
            onUpdateProfile={(num) => setProfile(prev => ({ ...prev, name: num.name }))}
            onTriggerCheckout={handleStripeCheckout}
            checkoutStatus={stripeCheckoutStatus}
          />
        );

      case 'admin':
        return (
          <AdminView
            onSeedRoadmap={handleSeedRoadmap}
            onClearCache={handleClearCache}
            apiCallsCounter={apiCallsCounter}
          />
        );

      default:
        return <p className="text-xs text-zinc-400">Section placeholder.</p>;
    }
  };


  // Clean authentication screens visualizer
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-[24px] bg-[#111111] border border-white/10 p-6 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-xl pointer-events-none" />
          
          <div className="text-center flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center shadow-lg border border-white/5">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h2 className="font-display font-extrabold text-xl tracking-tight mt-3">
              LearnPath <span className="text-purple-400">AI</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Premium Full-Stack AI Learning Platform</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            setIsAuthenticated(true);
          }} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 font-mono">Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Bobby Fisher"
                  className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-white focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-zinc-400 font-mono">Registry Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="bobby.fisher@learnpath.ai"
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-white focus:outline-hidden focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-1.5 font-sans">
              <div className="flex justify-between items-center bg-transparent text-[10px]">
                <label className="block uppercase font-bold text-zinc-400 font-mono">Security Password</label>
                <button type="button" className="text-zinc-500 hover:text-white cursor-pointer select-text">Forgot Credentials?</button>
              </div>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-xs text-white focus:outline-hidden focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-xs text-white bg-gradient-to-br from-purple-500 to-blue-600 hover:brightness-110 rounded-xl transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              {authMode === 'login' ? 'Confirm Sign In' : 'Create Free Account'}
            </button>
          </form>

          <div className="text-center pt-2 space-y-3.5 border-t border-white/5 pb-1.5">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
              }}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already registered? Sign In"}
            </button>

            {/* Quick Demo Bypass Button */}
            <div className="pt-2 bg-transparent">
              <button
                onClick={() => {
                  setIsAuthenticated(true);
                  setProfile(localData.profile);
                }}
                className="w-full py-2 border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 rounded-xl text-xs font-bold text-purple-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                id="btn-auth-demo-bypass"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Bypass with Demo Account</span>
              </button>
              <span className="block text-[10px] text-zinc-605 mt-1.5 font-sans leading-relaxed">Bypass enabled by standard developer flags. Seeding automatic sandbox database records.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active reading chapter lesson visual overrides
  const selectedLessonObj = activeLesson
    ? activeRoadmap.phases
        .find(p => p.id === activeLesson.phaseId)
        ?.levels.find(l => l.id === activeLesson.levelId)
        ?.lessons.find(le => le.id === activeLesson.lessonId)
    : null;

  return (
    <div className={`min-h-screen pb-20 ${themeClass} transition-colors duration-300 relative select-none`} style={customBackground}>
      {/* 1. Header component */}
      <MobileHeader
        profile={profile}
        notifications={notifications}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveLesson(null);
        }}
        onNotificationsClick={() => {
          setActiveTab('notifications');
          setActiveLesson(null);
        }}
        onUpgradeClick={() => {
          setActiveTab('profile');
          setActiveLesson(null);
        }}
        onOpenDrawer={() => setIsSidebarOpen(true)}
      />

      {/* 2. SideDrawer sidebar details */}
      <SideDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveLesson(null);
        }}
        profile={profile}
        onUpgradeClick={() => {
          setActiveTab('profile');
        }}
        onLogoutClick={() => {
          setIsAuthenticated(false);
          setActiveLesson(null);
        }}
      />

      {/* Primary tab Content Layout with desktop alignment container constraint */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 min-h-[calc(100vh-10rem)]">
        {selectedLessonObj ? (
          <LessonPlayView
            lesson={selectedLessonObj}
            onClose={() => setActiveLesson(null)}
            onComplete={handleLessonComplete}
          />
        ) : (
          renderTabContent()
        )}
      </main>

      {/* Simple admin panel console floating shortcut tab trigger (highly interactive!) */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => {
            setActiveTab(activeTab === 'admin' ? 'home' : 'admin');
            setActiveLesson(null);
          }}
          className="p-3 rounded-full bg-[#111111] border border-white/10 text-zinc-400 hover:text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
          title="Operations Admin Console"
          id="btn-trigger-admin-tab"
        >
          <Terminal className="w-5 h-5 text-purple-400 animate-pulse" />
        </button>
      </div>

      {/* 3. Bottom bar Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveLesson(null);
        }}
      />
    </div>
  );
}

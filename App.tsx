
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import DrawingCanvas from './components/DrawingCanvas';
import RightSidebar from './components/RightSidebar';
import { User, Post, Comment } from './types';
import { Camera, X, Star, Info, Clock, Calendar, RotateCcw } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

// 定义空白占位头像（浅灰色）
const BLANK_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f3f4f6"%3E%3Crect width="24" height="24" /%3E%3C/svg%3E';

const GUEST_USER: User = {
  id: 'guest',
  name: ' ',
  avatar: BLANK_AVATAR
};

const STORAGE_KEYS = {
  USER: 'hao_mao_user_v4',
  POSTS: 'hao_mao_posts_v4',
  STATS: 'hao_mao_stats_v4'
};

const App: React.FC = () => {
  const { t } = useLanguage();
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : GUEST_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp),
        comments: p.comments.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) }))
      }));
    } catch (e) {
      console.error("Failed to load posts", e);
      return [];
    }
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { level: 0, experience: 0 };
      }
    }
    return { level: 0, experience: 0 };
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'saved' | 'myPosts' | 'memories'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      content,
      image,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      isSaved: false
    };
    setPosts([newPost, ...posts]);
    
    // 更新等级经验：每次发帖增加 1/3 (约 33.34%)
    setStats((prev: any) => {
      let newExp = prev.experience + 33.34;
      let newLevel = prev.level;
      if (newExp >= 100) {
        newLevel += 1;
        newExp = 0; // 满 3 次直接清零进入下一级
      }
      return { level: newLevel, experience: newExp };
    });

    if (currentView !== 'home') setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, isSaved: !post.isSaved } : post));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleAddComment = (postId: string, comment: Comment) => {
    setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments.filter(c => c.id !== commentId) } 
        : post
    ));
  };

  const handleUpdateProfile = () => {
    if (!tempName.trim()) return;
    setCurrentUser(prev => ({ ...prev, name: tempName, avatar: tempAvatar }));
    setIsEditProfileModalOpen(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  let displayedPosts = [...posts];
  
  if (currentView === 'saved') {
    displayedPosts = displayedPosts.filter(p => p.isSaved);
  } else if (currentView === 'memories') {
    if (selectedDate) {
      displayedPosts = displayedPosts.filter(p => new Date(p.timestamp).toISOString().split('T')[0] === selectedDate);
    }
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedPosts = displayedPosts.filter(p => p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q));
  }

  return (
    <div className="min-h-screen bg-q-bg pb-24 font-cute selection:bg-q-pink/30 selection:text-white">
      <Navbar 
        currentUser={currentUser} 
        onRegisterClick={() => {}} 
        onProfileClick={() => {
          setTempName(currentUser.name);
          setTempAvatar(currentUser.avatar);
          setIsEditProfileModalOpen(true);
        }} 
        onSearch={setSearchQuery} 
      />

      <div className="max-w-full mx-auto mt-10 px-4 lg:px-[4%]">
        <div className="flex flex-col lg:flex-row lg:gap-[2%]">
          
          <div className={`hidden lg:block flex-shrink-0 sticky top-[120px] h-fit transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:w-[60px]' : 'lg:w-[15%]'}`}>
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              currentView={currentView} 
              onChangeView={setCurrentView} 
            />
          </div>

          <div className={`flex-1 w-full mx-auto lg:mx-0 transition-all duration-500 ${isSidebarCollapsed ? 'lg:w-[70%]' : 'lg:w-[58%]'}`}>
            {currentView === 'home' && (
              <>
                <div className="bg-white rounded-3xl p-6 mb-8 flex items-center gap-5 text-q-text font-bold shadow-q border-4 border-white animate-fadeInUp">
                   <div className="p-4 bg-q-blue/20 rounded-2xl text-q-blue"><Info className="w-8 h-8" /></div>
                   <div className="flex flex-col">
                     <span className="text-gray-800 text-lg leading-tight">{t('privacyNotice')}</span>
                     <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">100% Offline Storage</span>
                   </div>
                </div>
                <CreatePost currentUser={currentUser} onPostCreate={handleCreatePost} />
              </>
            )}

            {currentView === 'myPosts' && (
              <div className="mb-12">
                 <DrawingCanvas onSave={(img) => handleCreatePost("🎨 刚刚完成了一幅大作！", img)} />
              </div>
            )}

            {(currentView === 'saved' || currentView === 'memories') && (
              <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b-8 border-white/50">
                 <div className="flex items-center gap-6">
                   <div className={`p-6 rounded-bubble shadow-q border-4 border-white transform hover:rotate-6 transition-transform ${currentView === 'saved' ? 'bg-yellow-100 text-yellow-500' : 'bg-indigo-100 text-indigo-500'}`}>
                     {currentView === 'saved' ? <Star className="w-12 h-12 fill-current" /> : <Clock className="w-12 h-12" />}
                   </div>
                   <div>
                     <h2 className="text-5xl font-black text-gray-800 tracking-tight">{t(currentView)}</h2>
                     <p className="text-gray-400 font-bold text-lg mt-1">
                       {currentView === 'memories' ? '穿梭时空，找回记忆喵' : '珍藏在这里的每一份美好'}
                     </p>
                   </div>
                 </div>

                 {currentView === 'memories' && (
                   <div className="bg-white p-4 rounded-3xl shadow-q border-4 border-white flex items-center gap-4 animate-bounceIn">
                     <div className="flex items-center gap-3 px-4 border-r-4 border-gray-50">
                       <Calendar className="w-6 h-6 text-indigo-400" />
                       <input 
                         type="date" 
                         value={selectedDate}
                         onChange={(e) => setSelectedDate(e.target.value)}
                         className="bg-transparent outline-none font-black text-black cursor-pointer text-lg"
                       />
                     </div>
                     <button 
                       onClick={() => setSelectedDate('')}
                       className={`p-3 rounded-2xl transition-all ${selectedDate ? 'text-indigo-500 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-200 cursor-not-allowed'}`}
                       title="清除筛选"
                     >
                       <RotateCcw className="w-6 h-6" />
                     </button>
                   </div>
                 )}
              </div>
            )}

            {currentView !== 'myPosts' && (
              <div className="space-y-12">
                {displayedPosts.length > 0 ? (
                  displayedPosts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser} 
                      onToggleSave={handleToggleSave} 
                      onAddComment={handleAddComment} 
                      onDeletePost={handleDeletePost}
                      onDeleteComment={handleDeleteComment}
                    />
                  ))
                ) : (
                  <div className="text-center py-48 bg-white/50 backdrop-blur-sm rounded-[5rem] border-8 border-white shadow-q animate-fadeInUp group">
                     <div className="text-[10rem] mb-12 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 select-none">
                       {selectedDate ? '🌵' : currentView === 'saved' ? '✨' : '🍵'}
                     </div>
                     <h3 className="text-3xl font-black text-gray-300">
                       {selectedDate ? `${selectedDate} 还是空白的喵` : t('nothingHere')}
                     </h3>
                     <p className="text-gray-400 font-bold mt-4">快去写点什么记录下今天吧喵~</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`hidden xl:block flex-shrink-0 lg:w-[23%] sticky top-[120px] h-fit transition-all duration-500 ${isSidebarCollapsed ? 'opacity-0 translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
            <RightSidebar level={stats.level} experience={stats.experience} />
          </div>

        </div>
      </div>

      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-lg" onClick={() => setIsEditProfileModalOpen(false)}></div>
          <div className="bg-white rounded-[4rem] w-full max-w-xl p-12 shadow-2xl relative z-10 border-8 border-white animate-bounceIn">
             <div className="flex justify-between items-center mb-12">
               <h2 className="text-5xl font-black text-gray-800 tracking-tight">{t('editProfile')}</h2>
               <button onClick={() => setIsEditProfileModalOpen(false)} className="p-4 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                 <X className="w-10 h-10" />
               </button>
             </div>
             
             <div className="flex flex-col items-center gap-12 mb-14">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="absolute inset-0 bg-q-pink rounded-full blur-2xl opacity-20 scale-125 group-hover:opacity-40 transition-all"></div>
                  <img src={tempAvatar || BLANK_AVATAR} alt="avatar" className="relative w-52 h-52 rounded-full border-8 border-white shadow-q object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-16 h-16" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                
                <div className="w-full space-y-6">
                  <label className="text-2xl font-black text-gray-700 ml-6">{t('name')}</label>
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)} 
                    className="w-full bg-gray-50 border-4 border-transparent focus:border-q-blue/40 rounded-[2.5rem] px-10 py-6 outline-none transition-all text-2xl font-black text-black shadow-inner" 
                    placeholder="给自己起个好听的名字喵"
                  />
                </div>
             </div>

             <div className="flex gap-6">
               <button onClick={() => setIsEditProfileModalOpen(false)} className="flex-1 py-6 rounded-bubble font-black text-gray-400 hover:bg-gray-50 transition-colors text-2xl">
                 {t('cancel')}
               </button>
               <button onClick={handleUpdateProfile} className="flex-1 py-6 rounded-bubble font-black bg-gradient-to-r from-q-pink to-q-purple text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-2xl">
                 {t('save')}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

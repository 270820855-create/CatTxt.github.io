
import React, { useState } from 'react';
import { Search, Globe, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { languages, Language } from '../translations';

interface NavbarProps {
  currentUser: User;
  onRegisterClick: () => void;
  onProfileClick: () => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onProfileClick, onSearch }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const [isNaughtyMode, setIsNaughtyMode] = useState(false);
  
  const isGuest = currentUser.id === 'guest';
  const BLANK_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f3f4f6"%3E%3Crect width="24" height="24" /%3E%3C/svg%3E';

  const NICE_CAT = "耄耋.jpg";
  const NAUGHTY_CAT = "耄耋哈气.jpg";

  const handleLogoClick = () => {
    if (isLogoAnimating) return;
    setIsLogoAnimating(true);
    setIsNaughtyMode(!isNaughtyMode);
    setTimeout(() => setIsLogoAnimating(false), 500);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-xl px-6 py-4 rounded-b-[2.5rem] mx-4 mt-3 border-b-4 border-q-purple/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-4 group cursor-pointer select-none" 
          onClick={handleLogoClick}
        >
          <div className={`relative transition-all duration-500 ${isLogoAnimating ? 'scale-125' : 'group-hover:scale-105'}`}>
            <div className={`absolute inset-0 blur-md opacity-20 transition-all rounded-full ${isNaughtyMode ? 'bg-purple-600' : 'bg-red-400'} ${isLogoAnimating ? 'opacity-60 scale-150' : 'group-hover:opacity-40'}`}></div>
            <div className={`relative bg-white p-1 rounded-2xl shadow-xl transition-all duration-500 ring-4 ${isNaughtyMode ? 'ring-purple-400/30' : 'ring-q-pink/20'} ${isLogoAnimating ? 'animate-bounceIn rotate-12' : 'group-hover:rotate-6'}`}>
              <img 
                src={isNaughtyMode ? NAUGHTY_CAT : NICE_CAT} 
                alt="Logo" 
                className={`w-14 h-14 object-cover rounded-xl transition-all duration-500 ${isLogoAnimating ? 'rotate-[360deg]' : ''}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${isNaughtyMode ? 'Naughty' : 'Santa'}`;
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className={`text-3xl font-black bg-clip-text text-transparent transition-all duration-500 hidden sm:block font-cute leading-none ${
              isNaughtyMode 
                ? 'bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500' 
                : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500'
            }`}>
              {isNaughtyMode ? '坏猫备忘录' : '豪猫备忘录'}
            </h1>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-1 hidden lg:block transition-colors duration-500 ${isNaughtyMode ? 'text-indigo-400' : 'text-gray-400'}`}>
              {isNaughtyMode ? 'Mischievous Mode Active' : 'Personal Offline App'}
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <input
              type="text"
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-gray-50 border-4 border-transparent focus:border-q-blue/40 rounded-3xl py-3 pl-14 pr-6 outline-none transition-all shadow-inner text-lg font-bold text-black placeholder-gray-300 group-hover:bg-white group-hover:shadow-lg"
            />
            <Search className="absolute left-5 top-3.5 text-gray-300 w-6 h-6 group-hover:text-q-blue transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-2 hover:bg-white hover:border-q-blue/20 transition-all cursor-pointer shadow-sm">
              <Globe className="w-5 h-5 text-q-purple" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-sm text-black outline-none cursor-pointer appearance-none pr-4 font-bold"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code} className="text-black">{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div 
            onClick={onProfileClick}
            className="flex items-center gap-3 p-1.5 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-q-pink/20 hover:bg-white cursor-pointer transition-all shadow-sm"
          >
             <img 
               src={currentUser.avatar || BLANK_AVATAR} 
               alt="User" 
               className="w-11 h-11 rounded-full border-4 border-white shadow-md object-cover"
             />
             <span className="font-black text-black hidden lg:block pr-2">{isGuest ? t('guestName') : currentUser.name}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

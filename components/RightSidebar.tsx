
import React from 'react';
import { Award, Zap, Coffee, Cat, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RightSidebarProps {
  level: number;
  experience: number;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ level, experience }) => {
  const { t } = useLanguage();

  // 根据等级获取称号和样式
  const getLevelInfo = (lvl: number) => {
    if (lvl >= 3) {
      return {
        title: '备忘耄耋',
        icon: <Crown className="w-7 h-7" />,
        colorClass: 'text-indigo-600',
        bgClass: 'bg-indigo-100',
        accentClass: 'from-indigo-400 to-purple-500'
      };
    } else if (lvl >= 1) {
      return {
        title: '备忘大猫',
        icon: <Cat className="w-7 h-7" />,
        colorClass: 'text-q-purple',
        bgClass: 'bg-purple-50',
        accentClass: 'from-q-purple to-q-pink'
      };
    } else {
      return {
        title: '备忘小猫',
        icon: <Sparkles className="w-7 h-7" />,
        colorClass: 'text-q-blue',
        bgClass: 'bg-blue-50',
        accentClass: 'from-q-blue to-q-purple'
      };
    }
  };

  const levelInfo = getLevelInfo(level);
  
  // 计算剩余发帖数 (基于 33.34% 每次，发 3 次满 100%)
  const remainingPosts = Math.ceil((100 - experience) / 33.33);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Daily Motivation */}
      <div className="bg-gradient-to-br from-q-pink/20 to-q-purple/20 p-8 rounded-[2.5rem] border-4 border-white shadow-q animate-fadeIn relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="flex items-center gap-4 mb-6 relative">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-q-pink">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="font-black text-gray-800 text-2xl">每日喵语</h3>
        </div>
        <p className="text-gray-700 font-black text-xl leading-relaxed italic relative">
          "世界上没有比在暖暖的阳光下睡午觉更幸福的事情了喵~"
        </p>
      </div>

      {/* Badges/Stats */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-q border-4 border-white overflow-hidden relative group">
        <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700 bg-gradient-to-br ${levelInfo.accentClass}`}></div>
        
        <h3 className="font-black text-gray-800 text-2xl flex items-center gap-4 mb-8 relative">
          <div className={`p-3 rounded-2xl transition-all duration-500 ${levelInfo.bgClass} ${levelInfo.colorClass}`}>
            {levelInfo.icon}
          </div>
          <span className={`transition-all duration-500 ${levelInfo.colorClass}`}>
            {levelInfo.title}
          </span>
        </h3>

        <div className="flex flex-col gap-6 relative">
          <div className="flex items-center gap-5">
             <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-inner border-2 border-white transition-all duration-500 ${levelInfo.bgClass} ${levelInfo.colorClass}`}>
               Lv.{level}
             </div>
             <div className="flex-1">
               <div className="flex justify-between mb-2">
                 <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Progress</span>
                 <span className={`${levelInfo.colorClass} font-black text-xs`}>{Math.round(experience)}%</span>
               </div>
               <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
                 <div 
                   className={`h-full bg-gradient-to-r rounded-full transition-all duration-700 ease-out ${levelInfo.accentClass}`}
                   style={{ width: `${experience}%` }}
                 ></div>
               </div>
             </div>
          </div>
          
          <p className="text-gray-400 text-sm font-bold mt-2">
            {experience === 0 ? '发一个备忘录试试喵！' : `距离升到 Lv.${level + 1} 还要发 ${remainingPosts} 个喵~`}
          </p>

          <div className="flex gap-3">
             <div title="Coffee Lover" className={`p-4 rounded-2xl border-2 border-white shadow-sm hover:scale-110 transition-transform ${level >= 1 ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-200 grayscale'}`}>
               <Coffee className="w-6 h-6" />
             </div>
             <div title="Early Bird" className={`p-4 rounded-2xl border-2 border-white shadow-sm hover:scale-110 transition-transform ${level >= 3 ? 'bg-indigo-50 text-indigo-500' : 'bg-gray-50 text-gray-200 grayscale'}`}>
               <Award className="w-6 h-6" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;

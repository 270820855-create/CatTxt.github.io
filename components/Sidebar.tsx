
import React from 'react';
import { Home, Star, ChevronLeft, ChevronRight, Palette, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: 'home' | 'saved' | 'myPosts' | 'memories';
  onChangeView: (view: 'home' | 'saved' | 'myPosts' | 'memories') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, currentView, onChangeView }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'home', icon: <Home className="w-6 h-6" />, label: t('home'), color: "text-blue-400", bg: "bg-blue-50" },
    { id: 'memories', icon: <Clock className="w-6 h-6" />, label: t('memories'), color: "text-indigo-400", bg: "bg-indigo-50" },
    { id: 'myPosts', icon: <Palette className="w-6 h-6" />, label: t('myPosts'), color: "text-pink-400", bg: "bg-pink-50" },
    { id: 'saved', icon: <Star className="w-6 h-6" />, label: t('saved'), color: "text-yellow-400", bg: "bg-yellow-50" },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'home' || id === 'saved' || id === 'myPosts' || id === 'memories') {
      onChangeView(id as 'home' | 'saved' | 'myPosts' | 'memories');
    }
  };

  return (
    <div className="w-full pr-4 pb-10">
      {/* Toggle Button */}
      <div className={`flex mb-6 ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
        <button 
          onClick={onToggle}
          className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 text-gray-500 transition-all border-4 border-white active:scale-90"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center p-4 rounded-[1.8rem] cursor-pointer transition-all duration-300 group ${
                isCollapsed ? 'justify-center' : 'gap-5'
              } ${isActive ? 'bg-white shadow-q ring-4 ring-white' : 'hover:bg-white/60 hover:shadow-sm'}`}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`p-3 rounded-2xl ${item.bg} ${isActive ? 'scale-110 shadow-sm' : 'group-hover:scale-110'} transition-transform flex-shrink-0`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              {!isCollapsed && (
                <span className={`font-black text-xl whitespace-nowrap overflow-hidden text-ellipsis animate-fadeIn transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

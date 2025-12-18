import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Image, Smile, Send, X, Sparkles, Wand2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CreatePostProps {
  currentUser: User;
  onPostCreate: (content: string, image?: string) => void;
}

const EMOJI_LIST = [
  { char: '🐱', label: 'Catty' },
  { char: '✨', label: 'Magic' },
  { char: '🎨', label: 'Art' },
  { char: '🍵', label: 'Tea' },
  { char: '⭐', label: 'Star' },
  { char: '🧸', label: 'Cute' },
  { char: '🍬', label: 'Sweet' },
  { char: '💡', label: 'Idea' },
  { char: '✅', label: 'Done' },
  { char: '🌈', label: 'Rainbow' },
  { char: '🍕', label: 'Food' },
  { char: '💖', label: 'Love' },
];

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPostCreate }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePost = () => {
    if (content.trim() || image || selectedFeeling) {
      const finalContent = selectedFeeling 
        ? `${selectedFeeling} ${content.trim()}`.trim()
        : content.trim();
        
      onPostCreate(finalContent, image || undefined);
      setContent('');
      setImage(null);
      setSelectedFeeling(null);
      setShowEmojiPicker(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-[3.5rem] shadow-q p-10 mb-12 border-4 border-white relative overflow-hidden group/create animate-fadeInUp">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-q-pink/5 rounded-bl-[150px] -mr-16 -mt-16 pointer-events-none transition-transform duration-1000 group-hover/create:scale-125"></div>
      <div className="absolute -left-10 bottom-24 w-20 h-20 text-q-blue opacity-10 animate-float"><Wand2 size={80} /></div>

      <div className="flex gap-8 relative">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-q-pink rounded-full blur-xl opacity-20 scale-125"></div>
            <img 
              src={currentUser.avatar} 
              alt="User" 
              className="relative w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('whatsOnYourMind', { name: currentUser.name.split(' ')[0] })}
            className="w-full bg-gray-50/50 rounded-[2.5rem] p-8 min-h-[180px] border-4 border-transparent focus:border-white focus:bg-white focus:shadow-soft outline-none resize-none transition-all placeholder-gray-300 text-3xl font-black leading-relaxed text-black"
          />
          
          {image && (
            <div className="mt-6 relative inline-block animate-bounceIn">
              <div className="absolute -inset-2 bg-gradient-to-tr from-q-pink to-q-purple rounded-[2.5rem] blur-lg opacity-20"></div>
              <img src={image} alt="Preview" className="relative max-h-96 rounded-[2.5rem] border-8 border-white shadow-q object-cover" />
              <button 
                onClick={() => setImage(null)}
                className="absolute -top-5 -right-5 bg-red-400 text-white rounded-full p-3 shadow-xl hover:bg-red-500 hover:scale-110 active:scale-90 transition-all z-20 border-4 border-white"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-10 border-t-8 border-gray-50/50">
        <div className="flex flex-wrap gap-5 relative">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 px-8 py-5 rounded-bubble bg-gray-50 hover:bg-red-50 text-red-400 transition-all font-black text-xl group/btn border-4 border-transparent hover:border-white shadow-sm"
          >
             <Image className="w-8 h-8 group-hover/btn:rotate-12 transition-transform" />
             <span className="hidden sm:inline">照片喵</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="relative" ref={emojiPickerRef}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`flex items-center gap-4 px-8 py-5 rounded-bubble transition-all font-black text-xl border-4 shadow-sm ${showEmojiPicker ? 'bg-yellow-100 text-yellow-600 border-white' : 'bg-gray-50 hover:bg-yellow-50 text-yellow-500 border-transparent hover:border-white'}`}
            >
              <Smile className="w-8 h-8" />
              <span className="hidden sm:inline">{selectedFeeling ? selectedFeeling : '心情喵'}</span>
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-8 w-80 bg-white rounded-[3rem] shadow-2xl border-8 border-white p-8 z-50 animate-bounceIn">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h4 className="text-gray-400 text-sm font-black uppercase tracking-widest">选择心情喵</h4>
                  <button onClick={() => { setSelectedFeeling(null); setShowEmojiPicker(false); }} className="text-xs font-black text-red-300 hover:text-red-500 transition-colors">重置</button>
                </div>
                <div className="grid grid-cols-4 gap-5">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji.char}
                      onClick={() => {
                        setSelectedFeeling(emoji.char);
                        setShowEmojiPicker(false);
                      }}
                      className="text-4xl p-2 rounded-2xl hover:bg-yellow-50 hover:scale-125 transition-all flex items-center justify-center"
                    >
                      {emoji.char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handlePost}
          disabled={!content.trim() && !image}
          className="bg-gradient-to-r from-q-pink via-q-purple to-q-blue text-white px-16 py-5 rounded-bubble font-black text-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-5 border-4 border-white"
        >
          <span>发布喵</span>
          <Send className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

import React, { useState, useEffect, useCallback } from 'react';
import { Post, Comment, User } from '../types';
import { MessageCircle, Bookmark, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, comment: Comment) => void;
  onDeletePost?: (postId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUser, 
  onToggleSave, 
  onAddComment, 
  onDeletePost,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [showFullContent, setShowFullContent] = useState(false);
  const [isVanishing, setIsVanishing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  const performDelete = useCallback(() => {
    if (onDeletePost && !isVanishing) {
      setIsVanishing(true);
      setTimeout(() => {
        onDeletePost(post.id);
      }, 300);
    }
  }, [onDeletePost, post.id, isVanishing]);

  const handleDeletePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 移除确认框，实现直接删除
    performDelete();
  };

  // 键盘快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 只有在鼠标悬停在当前卡片上，且没有在输入框打字时才生效
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
      if (isHovered && !isTyping && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        performDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, performDelete]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: newComment,
      timestamp: new Date(),
    };
    onAddComment(post.id, comment);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    // 评论删除保留确认，防止评论误删，或可根据需求同样移除
    if (onDeleteComment && window.confirm(t('deleteCommentConfirm'))) {
      onDeleteComment(post.id, commentId);
    }
  };

  const isLongContent = post.content.length > 250;
  const displayedContent = (!showFullContent && isLongContent) 
    ? post.content.slice(0, 250) + '...' 
    : post.content;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-[3.5rem] shadow-q p-10 border-4 border-white hover:shadow-q-hover transition-all relative group/card ${isVanishing ? 'animate-fadeOut pointer-events-none' : 'animate-fadeInUp'}`}
    >
      
      {/* 顶部操作区 */}
      <div className="absolute top-8 right-10 flex items-center gap-3 z-30">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleSave(post.id); }}
          className={`p-4 rounded-[1.5rem] transition-all transform active:scale-90 ${post.isSaved ? 'text-yellow-500 scale-110 bg-yellow-50 shadow-sm' : 'text-gray-300 bg-gray-50 hover:bg-gray-100 hover:text-gray-500'}`}
          title={t('saveBtn')}
        >
          <Bookmark className={`w-7 h-7 ${post.isSaved ? 'fill-current' : ''}`} />
        </button>
        
        {onDeletePost && (
          <button 
            onClick={handleDeletePostClick}
            className="p-4 rounded-[1.5rem] text-gray-200 bg-gray-50 hover:text-red-500 hover:bg-red-50 hover:shadow-sm hover:scale-110 active:scale-90 transition-all opacity-0 group-hover/card:opacity-100"
            title="一键删除 (快捷键: Del)"
          >
            <Trash2 className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* 发布者信息 */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-q-pink to-q-purple rounded-full blur-md opacity-30 scale-110"></div>
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="relative w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>
        <div className="flex-1 pr-24">
          <h3 className="font-black text-3xl text-gray-800 leading-tight">{post.author.name || '神秘猫友'}</h3>
          <div className="flex items-center gap-3 text-gray-400 font-bold text-base mt-1">
            <span className="bg-gray-50 px-3 py-1 rounded-full">{new Date(post.timestamp).toLocaleDateString()}</span>
            <span className="opacity-30">•</span>
            <span className="bg-gray-50 px-3 py-1 rounded-full">{new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

      {/* 文本内容 */}
      <div className="mb-8">
        <div className="text-gray-800 text-2xl leading-relaxed whitespace-pre-wrap font-medium">
          {displayedContent}
          {isLongContent && (
            <button 
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-q-blue font-black ml-3 hover:underline underline-offset-8 transition-all"
            >
              {showFullContent ? '收起猫爪' : '展开阅读'}
            </button>
          )}
        </div>
        
        {post.image && (
          <div className="mt-8 relative group/img overflow-hidden rounded-[3rem] border-8 border-gray-50 shadow-sm bg-gray-50">
            <img 
              src={post.image} 
              alt="Memo visual" 
              className="w-full object-cover transition-transform duration-1000 group-hover/img:scale-110 max-h-[700px]"
            />
          </div>
        )}
      </div>

      {/* 底部备注区域 */}
      <div className="border-t-4 border-gray-50 pt-8 mb-8">
        <div className="flex items-center gap-4 px-4">
           <div className="p-3 bg-indigo-50 rounded-2xl">
             <MessageCircle className="w-8 h-8 text-indigo-400" />
           </div>
           <span className="text-gray-400 font-black text-xl">
             {post.comments.length > 0 ? `${post.comments.length} 条备忘记录` : '暂无备忘记录'}
           </span>
        </div>
      </div>

      {/* 评论发布框 */}
      <div className="space-y-6">
        <div className="flex gap-5 items-center">
           <img src={currentUser.avatar} className="w-12 h-12 rounded-full border-4 border-white shadow-sm flex-shrink-0" alt="Me" />
           <div className="flex-1 relative">
             <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder={t('writeComment')}
                className="w-full bg-gray-50 rounded-[2rem] py-5 px-10 outline-none focus:ring-8 focus:ring-q-blue/10 text-xl shadow-inner border-4 border-transparent focus:border-white focus:bg-white transition-all placeholder-gray-300 text-black font-bold"
             />
             <button 
               onClick={handleAddComment}
               disabled={!newComment.trim()}
               className={`absolute right-6 top-1/2 -translate-y-1/2 font-black text-xl transition-all ${newComment.trim() ? 'text-q-blue hover:scale-125' : 'text-gray-200 opacity-50 cursor-not-allowed'}`}
             >
               发布
             </button>
           </div>
        </div>
        
        {/* 评论列表 */}
        {post.comments.length > 0 && (
          <div className="mt-8 space-y-5 pl-6 border-l-8 border-q-blue/10">
             {post.comments.map(comment => (
                <div key={comment.id} className="group/comment flex flex-col animate-fadeIn relative bg-gray-50/50 p-6 rounded-[2rem] border-4 border-transparent hover:border-white hover:bg-white hover:shadow-q transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <img src={comment.author.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="av" />
                      <span className="font-black text-gray-700 text-xl">{comment.author.name}</span>
                      <span className="text-xs text-gray-300 font-black bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    {onDeleteComment && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="opacity-0 group-hover/comment:opacity-100 p-3 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-xl transition-all transform hover:rotate-12"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="text-gray-600 leading-relaxed pl-14 text-lg font-medium whitespace-pre-wrap">{comment.content}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

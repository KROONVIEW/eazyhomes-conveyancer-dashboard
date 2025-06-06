import React, { useState, useCallback } from 'react';
import { FiSmile, FiPlus } from 'react-icons/fi';

const MessageReactions = ({ messageId, reactions = [], onAddReaction, onRemoveReaction, currentUserId = 'user1' }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Popular emoji reactions for quick access
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏'];

  // Extended emoji set for picker
  const emojiCategories = {
    'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
    'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
    'Objects': ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '💫', '✨', '🔥', '💯', '✅', '❌', '⚡', '💡']
  };

  const handleEmojiClick = useCallback((emoji) => {
    const existingReaction = reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      const userReacted = existingReaction.users.includes(currentUserId);
      if (userReacted) {
        onRemoveReaction?.(messageId, emoji, currentUserId);
      } else {
        onAddReaction?.(messageId, emoji, currentUserId);
      }
    } else {
      onAddReaction?.(messageId, emoji, currentUserId);
    }
    
    setShowEmojiPicker(false);
  }, [reactions, messageId, currentUserId, onAddReaction, onRemoveReaction]);

  const handleReactionClick = useCallback((reaction) => {
    const userReacted = reaction.users.includes(currentUserId);
    if (userReacted) {
      onRemoveReaction?.(messageId, reaction.emoji, currentUserId);
    } else {
      onAddReaction?.(messageId, reaction.emoji, currentUserId);
    }
  }, [messageId, currentUserId, onAddReaction, onRemoveReaction]);

  // Group reactions by emoji and count
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: []
      };
    }
    acc[reaction.emoji].count += 1;
    acc[reaction.emoji].users.push(...reaction.users);
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Existing Reactions */}
      {Object.keys(groupedReactions).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 mb-1">
          {Object.values(groupedReactions).map((reaction) => {
            const userReacted = reaction.users.includes(currentUserId);
            return (
              <button
                key={reaction.emoji}
                onClick={() => handleReactionClick(reaction)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  userReacted
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
                title={`${reaction.users.join(', ')} reacted with ${reaction.emoji}`}
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="text-xs">{reaction.count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Add Reaction Button */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="inline-flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 text-xs"
          title="Add reaction"
        >
          <FiSmile className="w-3 h-3" />
          <FiPlus className="w-2 h-2" />
        </button>

        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-[300px] max-w-[400px]">
            {/* Quick Reactions */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Quick Reactions</h4>
              <div className="flex flex-wrap gap-2">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 text-lg"
                    title={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Categories */}
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category} className="mb-3">
                  <h5 className="text-xs font-medium text-gray-600 mb-2">{category}</h5>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200 hover:scale-110 text-sm"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Close button */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MessageReactions; 
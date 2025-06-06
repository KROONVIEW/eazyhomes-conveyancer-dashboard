import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FiSearch, FiX } from 'react-icons/fi';

const IOSEmojiPicker = ({ 
  isOpen, 
  onClose, 
  onEmojiSelect, 
  position = 'bottom-left',
  theme = 'light' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('smileys_people');
  const pickerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when opened
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    console.log('😊 Emoji selected:', emojiData);
    onEmojiSelect(emojiData.emoji);
    onClose();
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'bottom-left':
      default:
        return 'top-full left-0 mt-2';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-50 font-['Poppins']">
      <div 
        ref={pickerRef}
        className={`absolute ${getPositionClasses()} bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden`}
        style={{ 
          width: '350px', 
          height: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header with search */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Emojis</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="Close"
            >
              <FiX className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search emojis..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Emoji picker */}
        <div className="h-full overflow-hidden">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            searchValue={searchTerm}
            width="100%"
            height="320px"
            theme={theme}
            lazyLoadEmojis={true}
            previewConfig={{
              showPreview: false
            }}
            skinTonesDisabled={false}
            searchPlaceHolder="Search emojis..."
            defaultSkinTone="neutral"
            emojiStyle="apple" // iOS-style emojis
            categories={[
              {
                name: 'Smileys & People',
                category: 'smileys_people'
              },
              {
                name: 'Animals & Nature',
                category: 'animals_nature'
              },
              {
                name: 'Food & Drink',
                category: 'food_drink'
              },
              {
                name: 'Activities',
                category: 'activities'
              },
              {
                name: 'Travel & Places',
                category: 'travel_places'
              },
              {
                name: 'Objects',
                category: 'objects'
              },
              {
                name: 'Symbols',
                category: 'symbols'
              },
              {
                name: 'Flags',
                category: 'flags'
              }
            ]}
            style={{
              border: 'none',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Quick emoji suggestions component
export const QuickEmojiBar = ({ onEmojiSelect, className = '' }) => {
  const quickEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥'];

  return (
    <div className={`flex items-center gap-2 p-2 bg-gray-50 rounded-lg ${className}`}>
      <span className="text-xs text-gray-500 font-medium">Quick:</span>
      {quickEmojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect(emoji)}
          className="text-lg hover:bg-gray-200 rounded p-1 transition-colors"
          title={`Add ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

// Emoji reaction component
export const EmojiReaction = ({ emoji, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all
        ${isActive 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
        }
      `}
    >
      <span className="text-sm">{emoji}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
};

// Recent emojis hook
export const useRecentEmojis = () => {
  const [recentEmojis, setRecentEmojis] = useState(() => {
    const saved = localStorage.getItem('recentEmojis');
    return saved ? JSON.parse(saved) : ['😊', '👍', '❤️', '😂', '🎉'];
  });

  const addRecentEmoji = (emoji) => {
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      const updated = [emoji, ...filtered].slice(0, 10); // Keep only 10 recent
      localStorage.setItem('recentEmojis', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentEmojis, addRecentEmoji };
};

export default IOSEmojiPicker;

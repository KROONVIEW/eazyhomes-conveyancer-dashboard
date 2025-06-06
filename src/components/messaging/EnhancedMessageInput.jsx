import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiMic, FiVideo, FiX } from 'react-icons/fi';
import IOSEmojiPicker, { QuickEmojiBar, useRecentEmojis } from './EmojiPicker';
import FileAttachment from './FileAttachment';
import messageService, { MessageStatus } from '../../services/messageService';

const EnhancedMessageInput = ({
  onSendMessage,
  onTyping,
  placeholder = "Type a message...",
  disabled = false,
  activeConversationId,
  className = ''
}) => {
  // State management
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentPanelOpen, setIsAttachmentPanelOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [showQuickEmojis, setShowQuickEmojis] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Refs
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Hooks
  const { recentEmojis, addRecentEmoji } = useRecentEmojis();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Handle message change and typing indicator
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (onTyping && activeConversationId) {
      onTyping(true);
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator
      const newTimeout = setTimeout(() => {
        onTyping(false);
      }, 1000);
      
      setTypingTimeout(newTimeout);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    console.log('😊 Adding emoji to message:', emoji);
    
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      
      setMessage(newMessage);
      addRecentEmoji(emoji);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setMessage(prev => prev + emoji);
      addRecentEmoji(emoji);
    }
  };

  // Handle file selection
  const handleFilesSelected = (files) => {
    console.log('📎 Files selected:', files);
    setAttachedFiles(files);
  };

  // Handle file removal
  const handleRemoveFile = (fileId) => {
    console.log('🗑️ Removing file:', fileId);
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Handle send message
  const handleSendMessage = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || isSending || disabled) {
      return;
    }

    console.log('📤 Sending message:', { message, attachedFiles, activeConversationId });

    try {
      setIsSending(true);
      setSendingProgress(0);

      // Prepare message data
      const messageData = {
        content: message.trim(),
        conversationId: activeConversationId,
        type: attachedFiles.length > 0 ? 'attachment' : 'text',
        timestamp: new Date().toISOString(),
        status: MessageStatus.SENDING
      };

      // Simulate sending progress
      const progressInterval = setInterval(() => {
        setSendingProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 30, 90);
          return newProgress;
        });
      }, 100);

      let sentMessage;

      if (attachedFiles.length > 0) {
        // Send message with attachments
        for (const file of attachedFiles) {
          if (file.status !== 'uploaded') {
            throw new Error(`File ${file.name} is not uploaded yet`);
          }
        }

        sentMessage = await messageService.sendMessageWithAttachment(messageData, {
          files: attachedFiles
        });
      } else {
        // Send text message
        sentMessage = await messageService.sendMessage(messageData);
      }

      clearInterval(progressInterval);
      setSendingProgress(100);

      // Clear form
      setMessage('');
      setAttachedFiles([]);
      setIsAttachmentPanelOpen(false);
      setIsEmojiPickerOpen(false);

      // Focus back to textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }

      // Call parent callback
      if (onSendMessage) {
        onSendMessage(sentMessage);
      }

      console.log('✅ Message sent successfully:', sentMessage);

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Show error state
      setSendingProgress(0);
      
      // You could show a toast notification here
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setIsSending(false);
      setSendingProgress(0);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle paste for files
  const handlePaste = (e) => {
    const items = Array.from(e.clipboardData.items);
    const files = items
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFile())
      .filter(Boolean);

    if (files.length > 0) {
      console.log('📋 Files pasted:', files);
      // Convert to file objects and add to attachments
      const fileObjects = files.map(file => ({
        id: `paste_${Date.now()}_${Math.random()}`,
        file,
        name: file.name || `pasted-${Date.now()}.${file.type.split('/')[1]}`,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        status: 'pending'
      }));
      
      setAttachedFiles(prev => [...prev, ...fileObjects]);
      setIsAttachmentPanelOpen(true);
    }
  };

  // Check if send button should be enabled
  const canSend = (message.trim() || attachedFiles.length > 0) && !isSending && !disabled;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Attachment panel */}
      {isAttachmentPanelOpen && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
            <button
              onClick={() => setIsAttachmentPanelOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          
          <FileAttachment
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            attachedFiles={attachedFiles}
            maxFiles={5}
            maxSize={10 * 1024 * 1024}
          />
        </div>
      )}

      {/* Quick emoji bar */}
      {showQuickEmojis && (
        <div className="mb-2">
          <QuickEmojiBar
            onEmojiSelect={handleEmojiSelect}
            className="border rounded-lg"
          />
        </div>
      )}

      {/* Main input area */}
      <div className="flex items-end gap-2 p-3 bg-white border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => setIsAttachmentPanelOpen(!isAttachmentPanelOpen)}
          className={`
            flex-shrink-0 p-2 rounded-lg transition-colors
            ${isAttachmentPanelOpen 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }
          `}
          title="Attach files"
          disabled={disabled}
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-sm placeholder-gray-500 bg-transparent"
            style={{ 
              minHeight: '20px',
              maxHeight: '120px'
            }}
            rows={1}
          />
          
          {/* Sending progress */}
          {isSending && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${sendingProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className={`
              p-2 rounded-lg transition-colors
              ${isEmojiPickerOpen 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }
            `}
            title="Add emoji"
            disabled={disabled}
          >
            <FiSmile className="w-5 h-5" />
          </button>

          {/* Quick emoji toggle */}
          <button
            type="button"
            onClick={() => setShowQuickEmojis(!showQuickEmojis)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"
            title="Quick emojis"
            disabled={disabled}
          >
            <span className="text-sm">😊</span>
          </button>

          {/* Voice message button (placeholder) */}
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            title="Voice message"
            disabled={disabled}
          >
            <FiMic className="w-5 h-5" />
          </button>

          {/* Video call button (placeholder) */}
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            title="Video call"
            disabled={disabled}
          >
            <FiVideo className="w-5 h-5" />
          </button>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!canSend}
            className={`
              p-2 rounded-lg transition-all duration-200 transform
              ${canSend
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
              ${isSending ? 'animate-pulse' : ''}
            `}
            title={isSending ? 'Sending...' : 'Send message'}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Emoji picker */}
      <IOSEmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelect={handleEmojiSelect}
        position="top-right"
        theme="light"
      />

      {/* Attachment count indicator */}
      {attachedFiles.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
          {attachedFiles.length}
        </div>
      )}
    </div>
  );
};

export default EnhancedMessageInput; 
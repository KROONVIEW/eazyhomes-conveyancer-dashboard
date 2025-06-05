import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiSend, FiUsers, FiAlertCircle, FiBold, FiItalic, FiList, FiLink, FiCheck, FiPlus, FiEdit2 } from 'react-icons/fi';
import broadcastService from '../../services/broadcastService';

const BroadcastComposer = ({ isOpen, onClose, onSendBroadcast, userRole = 'admin' }) => {
  const [recipients, setRecipients] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customRecipients, setCustomRecipients] = useState([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState('');
  const [customGroupName, setCustomGroupName] = useState('');
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);

  // Check if user has admin privileges
  const isAdmin = userRole === 'admin' || userRole === 'administrator';

  // Load user groups and available users on component mount
  useEffect(() => {
    if (isOpen) {
      const groups = broadcastService.getUserGroups();
      setUserGroups(groups);
      
      // Load all available users for manual selection
      const allUsers = Object.keys(broadcastService.userProfiles).map(userId => ({
        id: userId,
        ...broadcastService.getUserProfile(userId)
      }));
      setAvailableUsers(allUsers);
      
      setSuccessMessage('');
      setErrorMessage('');
      setCustomRecipients([]);
      setShowUserSelector(false);
      setSearchUsers('');
      setCustomGroupName('');
      setIsEditingGroupName(false);
    }
  }, [isOpen]);

  const handleSendBroadcast = useCallback(async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in both subject and message fields.');
      return;
    }

    if (recipients === 'new-group' && customRecipients.length === 0) {
      setErrorMessage('Please add at least one member to your new group.');
      return;
    }

    if (!isAdmin) {
      setErrorMessage('Only administrators can send broadcasts.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Prepare recipient data with custom modifications
      const finalRecipients = customRecipients.length > 0 ? {
        groupId: recipients === 'new-group' ? 'new-group' : 'custom',
        groupName: recipients === 'new-group' ? (customGroupName || 'New Group') : 'Custom Recipients',
        memberCount: customRecipients.length,
        members: customRecipients.map(user => user.id)
      } : recipients;

      const broadcastData = {
        subject: subject.trim(),
        message: message.trim(),
        recipients: finalRecipients,
        priority,
        sender: 'Firm Administration'
      };

      // Send through broadcast service
      const sentBroadcast = await broadcastService.sendBroadcast(broadcastData);
      
      // Call parent callback with the sent broadcast
      await onSendBroadcast?.(sentBroadcast);
      
      // Show success message
      const targetInfo = customRecipients.length > 0 
        ? { 
            name: recipients === 'new-group' ? (customGroupName || 'New Group') : 'Custom Recipients', 
            count: customRecipients.length 
          }
        : broadcastService.getUserGroup(recipients);
      setSuccessMessage(`Broadcast sent successfully to ${targetInfo.name} (${targetInfo.count} members)`);
      
      // Reset form after delay
      setTimeout(() => {
        setSubject('');
        setMessage('');
        setPriority('normal');
        setRecipients('all');
        setSuccessMessage('');
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      setErrorMessage(error.message || 'Failed to send broadcast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [subject, message, recipients, priority, isAdmin, onSendBroadcast, onClose]);

  const handleClose = useCallback(() => {
    setSubject('');
    setMessage('');
    setPriority('normal');
    setRecipients('all');
    setSuccessMessage('');
    setErrorMessage('');
          setCustomRecipients([]);
      setShowUserSelector(false);
      setSearchUsers('');
      setCustomGroupName('');
      setIsEditingGroupName(false);
      onClose();
  }, [onClose]);

  // Initialize custom recipients when group changes
  const handleGroupChange = useCallback((groupId) => {
    setRecipients(groupId);
    
    if (groupId === 'new-group') {
      // New custom group - start fresh
      setCustomRecipients([]);
      setCustomGroupName('New Group');
      setIsEditingGroupName(true);
      setShowUserSelector(true);
    } else if (groupId !== 'custom') {
      // Load default group members as starting point for customization
      const group = broadcastService.getUserGroup(groupId);
      if (group) {
        const groupUsers = group.members.map(memberId => ({
          id: memberId,
          ...broadcastService.getUserProfile(memberId)
        }));
        setCustomRecipients(groupUsers);
      }
      setCustomGroupName('');
      setIsEditingGroupName(false);
    } else {
      setCustomRecipients([]);
      setCustomGroupName('');
      setIsEditingGroupName(false);
    }
  }, []);

  // Add user to custom recipients
  const handleAddUser = useCallback((user) => {
    if (!customRecipients.find(u => u.id === user.id)) {
      setCustomRecipients(prev => [...prev, user]);
    }
    setSearchUsers('');
  }, [customRecipients]);

  // Remove user from custom recipients
  const handleRemoveUser = useCallback((userId) => {
    setCustomRecipients(prev => prev.filter(u => u.id !== userId));
  }, []);

  // Get filtered available users for search
  const getFilteredUsers = useCallback(() => {
    return availableUsers.filter(user => 
      !customRecipients.find(u => u.id === user.id) &&
      (user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
       user.role.toLowerCase().includes(searchUsers.toLowerCase()))
    );
  }, [availableUsers, customRecipients, searchUsers]);

  // Rich text formatting functions
  const formatText = useCallback((format) => {
    const textarea = document.getElementById('broadcast-message');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    
    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = `\n• ${selectedText}`;
        break;
      default:
        break;
    }
    
    const newMessage = message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);
  }, [message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              📢
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Compose Broadcast</h2>
              <p className="text-sm text-gray-600">Send an official announcement to your team</p>
            </div>
          </div>
        </div>

        {/* Admin Check */}
        {!isAdmin && (
          <div className="p-4 mx-6 mt-6 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <strong>Access Denied:</strong> Only administrators can send firm-wide broadcasts.
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 mx-6 mt-6 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <strong>Success:</strong> {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 mx-6 mt-6 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSendBroadcast} className="p-6 space-y-6">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FiUsers className="w-4 h-4 inline mr-2" />
              Recipients
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {userGroups.map((group) => (
                <label
                  key={group.id}
                  className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    recipients === group.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                                      <input
                      type="radio"
                      name="recipients"
                      value={group.id}
                      checked={recipients === group.id}
                      onChange={(e) => handleGroupChange(e.target.value)}
                      className="sr-only"
                      disabled={!isAdmin}
                    />
                  <span className="font-medium text-gray-900">{group.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{group.count} members</span>
                  
                  {/* Special indicator for Project Team Alpha */}
                  {group.id === 'project_team' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {group.members.slice(0, 3).map((memberId) => {
                        const profile = broadcastService.getUserProfile(memberId);
                        return (
                          <span key={memberId} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {profile?.name?.split(' ')[0] || memberId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  
                  {recipients === group.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </label>
              ))}
              
              {/* New Group Option */}
              {isAdmin && (
                <label
                  className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    recipients === 'new-group'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="recipients"
                    value="new-group"
                    checked={recipients === 'new-group'}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <FiPlus className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900">New Group</span>
                  </div>
                  <span className="text-xs text-gray-500">Create custom group</span>
                  
                  {recipients === 'new-group' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Custom Recipients Management */}
          {recipients !== 'all' && isAdmin && (
            <div>
              {/* Group Name Editor for New Group */}
              {recipients === 'new-group' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Name
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingGroupName ? (
                      <input
                        type="text"
                        value={customGroupName}
                        onChange={(e) => setCustomGroupName(e.target.value)}
                        onBlur={() => setIsEditingGroupName(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingGroupName(false);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
                        placeholder="Enter group name..."
                        autoFocus
                        maxLength={50}
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditingGroupName(true)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {customGroupName || 'New Group'}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingGroupName(!isEditingGroupName)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Edit group name"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Click to edit group name</span>
                    <span className="text-xs text-gray-400">{customGroupName.length}/50</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  {recipients === 'new-group' ? 'Group Members' : 'Customize Recipients'} ({customRecipients.length} selected)
                </label>
                <div className="flex gap-2">
                  {recipients !== 'new-group' && (
                    <button
                      type="button"
                      onClick={() => {
                        const group = broadcastService.getUserGroup(recipients);
                        if (group) {
                          const groupUsers = group.members.map(memberId => ({
                            id: memberId,
                            ...broadcastService.getUserProfile(memberId)
                          }));
                          setCustomRecipients(groupUsers);
                        }
                      }}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                      title="Reset to default group members"
                    >
                      Reset
                    </button>
                  )}
                  {recipients === 'new-group' && (
                    <button
                      type="button"
                      onClick={() => setCustomRecipients([])}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                      title="Clear all members"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowUserSelector(!showUserSelector)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showUserSelector ? 'Hide' : 'Add/Remove Users'}
                  </button>
                </div>
              </div>

              {/* Selected Recipients Display */}
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {customRecipients.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      <span className="text-xs text-gray-500">({user.role})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove user"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {customRecipients.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No recipients selected</p>
                  )}
                </div>
              </div>

              {/* User Selector */}
              {showUserSelector && (
                <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-white">
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Search users by name or role..."
                      value={searchUsers}
                      onChange={(e) => setSearchUsers(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {getFilteredUsers().slice(0, 10).map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleAddUser(user)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                    {getFilteredUsers().length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        {searchUsers ? 'No users found matching your search' : 'All users are already selected'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Priority Level</label>
            <div className="flex gap-3">
              {[
                { value: 'normal', label: 'Normal', color: 'gray' },
                { value: 'important', label: 'Important', color: 'yellow' },
                { value: 'urgent', label: 'Urgent', color: 'red' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    priority === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={priority === option.value}
                    onChange={(e) => setPriority(e.target.value)}
                    className="sr-only"
                    disabled={!isAdmin}
                  />
                  <span className={`font-medium ${
                    priority === option.value ? `text-${option.color}-700` : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="broadcast-subject" className="block text-sm font-semibold text-gray-700 mb-3">
              Subject Line
            </label>
            <input
              id="broadcast-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter broadcast subject..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={!isAdmin}
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">This will appear as the message preview</span>
              <span className="text-xs text-gray-400">{subject.length}/100</span>
            </div>
          </div>

          {/* Rich Text Toolbar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Message Content</label>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-3 bg-gray-50 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => formatText('bold')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
                  title="Bold"
                  disabled={!isAdmin}
                >
                  <FiBold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatText('italic')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
                  title="Italic"
                  disabled={!isAdmin}
                >
                  <FiItalic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatText('list')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
                  title="Bullet List"
                  disabled={!isAdmin}
                >
                  <FiList className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
                  title="Add Link"
                  disabled={!isAdmin}
                >
                  <FiLink className="w-4 h-4" />
                </button>
              </div>
              
              {/* Message Input */}
              <textarea
                id="broadcast-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your broadcast message here... Use **bold** and *italic* for formatting."
                className="w-full px-4 py-4 border-0 focus:outline-none resize-none"
                rows="6"
                disabled={!isAdmin}
                maxLength={1000}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Supports basic markdown formatting</span>
              <span className="text-xs text-gray-400">{message.length}/1000</span>
            </div>
          </div>

          {/* Preview */}
          {(subject || message) && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <h4 className="text-sm font-semibold text-purple-700 mb-2">Preview:</h4>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-700">📢 Firm Administration</span>
                  <span className="text-xs text-gray-500">now</span>
                </div>
                {subject && <div className="font-semibold text-gray-900 mb-1">{subject}</div>}
                {message && <div className="text-sm text-gray-700 whitespace-pre-wrap">{message}</div>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isAdmin || !subject.trim() || !message.trim() || isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Send Broadcast
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BroadcastComposer; 
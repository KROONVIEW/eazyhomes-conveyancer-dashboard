import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon, CalendarIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

const CalendarPage = () => {
  // Set initial date to 2025 for optimization
  const [currentDate, setCurrentDate] = useState(new Date('2025-01-01T12:00:00'));
  const [currentView, setCurrentView] = useState('Month');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalFields, setModalFields] = useState({
    title: '',
    date: '',
    time: '',
    person: '',
    type: 'Meeting',
    color: '#3B82F6',
    description: '',
  });
  
  const [userEvents, setUserEvents] = useState([]);

  // Current user for "My Schedule" filtering
  const currentUser = 'Eddie Lobovski';

  // Enhanced mock events with person assignments for 2025
  const mockEvents = [
    { id: 1, date: '2025-01-02', type: 'Drafting', title: 'Drafting (First Stage)', person: 'Eddie Lobovski', color: '#3B82F6', time: '09:00', description: 'Initial property transfer documentation' },
    { id: 2, date: '2025-01-16', type: 'Signing', title: 'Signing (Wilson Doc)', person: 'Alexey Sheve', color: '#F59E0B', time: '14:00', description: 'Document signing ceremony' },
    { id: 3, date: '2025-01-01', type: 'Holiday', title: 'New Year\'s Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 4, date: '2025-01-20', type: 'Holiday', title: 'Martin Luther King Jr. Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 5, date: '2025-02-17', type: 'Holiday', title: 'Presidents\' Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 6, date: '2025-05-26', type: 'Holiday', title: 'Memorial Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 7, date: '2025-07-04', type: 'Holiday', title: 'Independence Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 8, date: '2025-09-01', type: 'Holiday', title: 'Labor Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 9, date: '2025-11-27', type: 'Holiday', title: 'Thanksgiving Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 10, date: '2025-12-25', type: 'Holiday', title: 'Christmas Day', person: 'Public Holiday', color: '#10B981', time: 'All Day', description: 'Public Holiday' },
    { id: 11, date: '2025-01-15', type: 'Review', title: 'Bond Grant App. Review', person: 'Anton Tlachche', color: '#EF4444', time: '11:00', description: 'Review bond application documents' },
    { id: 12, date: '2025-01-08', type: 'Meeting', title: 'Meeting with Conveyancer', person: 'Eddie Lobovski', color: '#8B5CF6', time: '15:30', description: 'Discuss property transfer details' },
  ];

  // People with enhanced data
  const people = [
    { name: 'Eddie Lobovski', email: 'eddie@easyhomes.com', avatar: '/images/avatars/face_1 (2).jpg', role: 'Senior Conveyancer' },
    { name: 'Alexey Sheve', email: 'alexey@easyhomes.com', avatar: '/images/avatars/face_1 (3).jpg', role: 'Legal Assistant' },
    { name: 'Anton Tlachche', email: 'anton@easyhomes.com', avatar: '/images/avatars/mock_anton.jpg', role: 'Property Specialist' },
  ];

  // Event types with colors
  const eventTypes = [
    { name: 'Meeting', color: '#8B5CF6' },
    { name: 'Drafting', color: '#3B82F6' },
    { name: 'Signing', color: '#F59E0B' },
    { name: 'Review', color: '#EF4444' },
    { name: 'Consultation', color: '#06B6D4' },
    { name: 'Deadline', color: '#DC2626' },
    { name: 'Follow-up', color: '#059669' },
  ];

  // Combine all events
  const allEvents = useMemo(() => {
    let events = [...mockEvents, ...userEvents];
    
    // Filter by selected person
    if (selectedPerson) {
      if (selectedPerson === 'My Schedule') {
        events = events.filter(event => event.person === currentUser);
      } else {
        events = events.filter(event => event.person === selectedPerson);
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return events;
  }, [mockEvents, userEvents, selectedPerson, searchTerm, currentUser]);

  // Calendar generation functions
  const generateMiniCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const miniDays = [];
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      miniDays.push({ day: prevMonthTotalDays - i, isCurrentMonth: false, fullDate: null });
    }
    for (let i = 1; i <= numDays; i++) {
      miniDays.push({
        day: i,
        isCurrentMonth: true,
        fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    const remainingCells = 42 - miniDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      miniDays.push({ day: i, isCurrentMonth: false, fullDate: null });
    }
    return miniDays;
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const days = [];
    const totalCells = 6 * 7;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, fullDate: null });
    }
    for (let i = 1; i <= numDays; i++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, isCurrentMonth: true, fullDate });
    }
    while (days.length < totalCells) {
      days.push({ day: days.length - numDays - (startDayOfWeek - 1) + 1, isCurrentMonth: false, fullDate: null });
    }
    return days;
  };

  const miniCalendarDays = generateMiniCalendarDays(currentDate);
  const calendarDays = generateCalendarDays(currentDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().toISOString().substring(0, 10);

  // Event handlers
  const handleCreateEvent = () => {
    if (!modalFields.title || !modalFields.date) {return;}
    
    const newEvent = {
      id: Date.now(),
      date: modalFields.date,
      type: modalFields.type,
      title: modalFields.title,
      person: modalFields.person,
      color: modalFields.color,
      time: modalFields.time || 'All Day',
      description: modalFields.description,
    };
    
    setUserEvents(prev => [...prev, newEvent]);
    setShowCreateModal(false);
    setModalFields({
      title: '',
      date: '',
      time: '',
      person: '',
      type: 'Meeting',
      color: '#3B82F6',
      description: '',
    });
  };

  const handleEditEvent = () => {
    if (!modalFields.title || !modalFields.date || !selectedEvent) {return;}
    
    const updatedEvent = {
      ...selectedEvent,
      date: modalFields.date,
      type: modalFields.type,
      title: modalFields.title,
      person: modalFields.person,
      color: modalFields.color,
      time: modalFields.time || 'All Day',
      description: modalFields.description,
    };
    
    // Update in userEvents if it's a user-created event
    setUserEvents(prev => prev.map(event => 
      event.id === selectedEvent.id ? updatedEvent : event
    ));
    
    // Update the selectedEvent for the details modal
    setSelectedEvent(updatedEvent);
    
    setShowEditModal(false);
    setModalFields({
      title: '',
      date: '',
      time: '',
      person: '',
      type: 'Meeting',
      color: '#3B82F6',
      description: '',
    });
  };

  const handleEditButtonClick = () => {
    if (!selectedEvent) {return;}
    
    // Populate modal fields with selected event data
    setModalFields({
      title: selectedEvent.title || '',
      date: selectedEvent.date || '',
      time: selectedEvent.time === 'All Day' ? '' : selectedEvent.time || '',
      person: selectedEvent.person || '',
      type: selectedEvent.type || 'Meeting',
      color: selectedEvent.color || '#3B82F6',
      description: selectedEvent.description || '',
    });
    
    setShowEditModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handlePersonFilter = (personName) => {
    setSelectedPerson(selectedPerson === personName ? null : personName);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    console.log(`Calendar view changed to: ${view}`);
  };

  return (
    <div className='flex flex-row flex-1 p-6 md:p-8 bg-gray-50 overflow-auto h-screen'>
      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full mx-6 relative transform transition-all duration-300 ease-out scale-100" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Schedule</h2>
                <p className="text-gray-500 mt-1">Add a new event to your calendar</p>
            </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="p-3 hover:bg-gray-100/80 rounded-2xl transition-all duration-200 group"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Event Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                  Event Title
                </label>
                <input
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400" 
                  placeholder="What's the event about?"
                  value={modalFields.title} 
                  onChange={e => setModalFields(f => ({ ...f, title: e.target.value }))} 
                />
              </div>
              
                             {/* Date & Time */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Date
                   </label>
                <input
                  type="date"
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200"
                     value={modalFields.date}
                     onChange={e => setModalFields(f => ({ ...f, date: e.target.value }))}
                />
              </div>
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Time
                   </label>
                <input
                  type="time"
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200"
                     value={modalFields.time}
                     onChange={e => setModalFields(f => ({ ...f, time: e.target.value }))}
                />
              </div>
            </div>
               
               {/* Assigned To & Type */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Assigned To
                   </label>
                   <select
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                     value={modalFields.person}
                     onChange={e => setModalFields(f => ({ ...f, person: e.target.value }))}
                   >
                     <option value="">Choose a person...</option>
                     {people.map(person => (
                       <option key={person.name} value={person.name}>{person.name}</option>
                     ))}
                   </select>
                 </div>
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Event Type
                   </label>
                   <select
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                     value={modalFields.type}
                     onChange={e => {
                       const selectedType = eventTypes.find(type => type.name === e.target.value);
                       setModalFields(f => ({ 
                         ...f, 
                         type: e.target.value,
                         color: selectedType ? selectedType.color : '#3B82F6'
                       }));
                     }}
                   >
                     {eventTypes.map(type => (
                       <option key={type.name} value={type.name}>{type.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
               
               {/* Color Selection */}
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-4">
                   Event Color
                 </label>
                 <div className="flex flex-wrap gap-3">
                   {eventTypes.map(type => (
                     <button
                       key={type.color}
                       className={`w-12 h-12 rounded-2xl border-3 transition-all duration-200 transform hover:scale-110 ${
                         modalFields.color === type.color 
                           ? 'border-gray-800 shadow-lg scale-110' 
                           : 'border-gray-200 hover:border-gray-400'
                       }`}
                       style={{ backgroundColor: type.color }}
                       onClick={() => setModalFields(f => ({ ...f, color: type.color }))}
                       title={type.name}
                     />
                   ))}
                 </div>
               </div>
               
               {/* Description */}
               <div className="group">
                 <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                   Description
                 </label>
              <textarea
                   className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                   rows="4"
                   placeholder="Add any additional details about this event..."
                value={modalFields.description}
                onChange={e => setModalFields(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-100">
              <button 
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
                             <button 
                 className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                 onClick={handleCreateEvent}
               >
                 Create Event
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full mx-6 relative transform transition-all duration-300 ease-out scale-100" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Schedule</h2>
                <p className="text-gray-500 mt-1">Update your calendar event</p>
            </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="p-3 hover:bg-gray-100/80 rounded-2xl transition-all duration-200 group"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Event Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                  Event Title
                </label>
                <input
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400" 
                  placeholder="What's the event about?"
                  value={modalFields.title} 
                  onChange={e => setModalFields(f => ({ ...f, title: e.target.value }))} 
                />
              </div>
              
                             {/* Date & Time */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Date
                   </label>
                <input
                  type="date"
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200"
                     value={modalFields.date}
                     onChange={e => setModalFields(f => ({ ...f, date: e.target.value }))}
                />
              </div>
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Time
                   </label>
                <input
                  type="time"
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200"
                     value={modalFields.time}
                     onChange={e => setModalFields(f => ({ ...f, time: e.target.value }))}
                />
              </div>
            </div>
               
               {/* Assigned To & Type */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Assigned To
                   </label>
                   <select
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                     value={modalFields.person}
                     onChange={e => setModalFields(f => ({ ...f, person: e.target.value }))}
                   >
                     <option value="">Choose a person...</option>
                     {people.map(person => (
                       <option key={person.name} value={person.name}>{person.name}</option>
                     ))}
                   </select>
                 </div>
                 <div className="group">
                   <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                     Event Type
                   </label>
                   <select
                     className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
                     value={modalFields.type}
                     onChange={e => {
                       const selectedType = eventTypes.find(type => type.name === e.target.value);
                       setModalFields(f => ({ 
                         ...f, 
                         type: e.target.value,
                         color: selectedType ? selectedType.color : '#3B82F6'
                       }));
                     }}
                   >
                     {eventTypes.map(type => (
                       <option key={type.name} value={type.name}>{type.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
               
               {/* Color Selection */}
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-4">
                   Event Color
                 </label>
                 <div className="flex flex-wrap gap-3">
                   {eventTypes.map(type => (
                     <button
                       key={type.color}
                       className={`w-12 h-12 rounded-2xl border-3 transition-all duration-200 transform hover:scale-110 ${
                         modalFields.color === type.color 
                           ? 'border-gray-800 shadow-lg scale-110' 
                           : 'border-gray-200 hover:border-gray-400'
                       }`}
                       style={{ backgroundColor: type.color }}
                       onClick={() => setModalFields(f => ({ ...f, color: type.color }))}
                       title={type.name}
                     />
                   ))}
                 </div>
               </div>
               
               {/* Description */}
               <div className="group">
                 <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                   Description
                 </label>
              <textarea
                   className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                   rows="4"
                   placeholder="Add any additional details about this event..."
                value={modalFields.description}
                onChange={e => setModalFields(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-100">
              <button 
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
                             <button 
                 className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                 onClick={handleEditEvent}
               >
                 Update Event
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50" onClick={() => setShowEventModal(false)}>
          <div className="bg-white h-full w-96 shadow-2xl p-8 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
              <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedEvent.title}</h3>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: selectedEvent.color }}>
                  {selectedEvent.type}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{selectedEvent.time}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{selectedEvent.person}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <TagIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{selectedEvent.type}</span>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="pt-6 border-t border-gray-200">
                <button 
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={handleEditButtonClick}
                >
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Column */}
      <div className="w-80 flex-shrink-0 flex flex-col h-full justify-stretch">
        <div className="flex flex-col h-full space-y-6 justify-between">
          {/* Top: Create Schedule and Mini Calendar */}
          <div>
            <button 
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full transform hover:scale-105" 
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Schedule</span>
            </button>
            
            <div className="mt-6">
              <DashboardCard className="p-4 flex flex-col items-center">
                <h3 className="font-semibold text-gray-800 mb-4">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                  {daysOfWeek.map(day => <div key={day}>{day.substring(0,1)}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {miniCalendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-colors
                        ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
                        ${day.fullDate === today ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => day.fullDate && setCurrentDate(new Date(day.fullDate))}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
          
          {/* Bottom: People Section */}
          <div className="flex-1 flex flex-col justify-end">
            <DashboardCard title="People" className="flex flex-col h-full">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events or people"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-3 flex-1">
                {people.map((person, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPerson === person.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePersonFilter(person.name)}
                  >
                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{person.name}</p>
                      <p className="text-gray-500 text-xs">{person.role}</p>
                    </div>
                    {selectedPerson === person.name && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                className={`w-full mt-6 py-3 border-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedPerson === 'My Schedule' 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => handlePersonFilter('My Schedule')}
              >
                My Schedule
              </button>
              
              {selectedPerson && (
                <button 
                  className="w-full mt-2 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  onClick={() => setSelectedPerson(null)}
                >
                  Clear Filter
                </button>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>

      {/* Right Column: Main Calendar Grid */}
      <div className="flex-1 flex flex-col h-full">
        <DashboardCard className="p-0 h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-xl font-semibold text-gray-800">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['Day', 'Week', 'Month', 'Year'].map(view => (
                  <button
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === view ? 'bg-white shadow text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
              {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
          </div>
          
          <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden flex-grow">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`h-32 flex flex-col p-2 pt-1 text-sm relative group
                  ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-800'}
                  ${day.fullDate === today && day.isCurrentMonth ? 'border-2 border-blue-500 z-10 -m-px' : 'border-b border-r border-gray-200'}
                  hover:bg-blue-50 transition-colors duration-200 ease-in-out`}
              >
                <span className={`font-semibold mb-1 text-right ${day.fullDate === today && day.isCurrentMonth ? 'text-blue-600' : ''}`}>
                  {day.day}
                </span>
                
                <div className="flex-grow overflow-y-auto text-xs space-y-1">
                  {day.isCurrentMonth && allEvents
                    .filter(event => event.date === day.fullDate)
                    .map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className="px-2 py-1 rounded-md truncate cursor-pointer text-white font-medium hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: event.color }}
                        title={`${event.title} - ${event.person} (${event.time})`}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default CalendarPage; 
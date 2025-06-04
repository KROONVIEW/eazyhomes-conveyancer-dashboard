import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CalendarPage = () => {
  // Set initial date to match screenshot (December 2, 2021)
  const [currentDate, setCurrentDate] = useState(new Date('2021-12-02T12:00:00'));
  const [currentView, setCurrentView] = useState('Month');
  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    description: '',
    matter: '',
    attendees: '',
    allDay: false,
    repeats: 'None',
    repeatDetails: '',
  });
  const [userEvents, setUserEvents] = useState([]);

  // Dummy events matching screenshot colors/content
  const events = [
    { id: 1, date: '2021-12-02', type: 'task', title: 'Drafting (First Stage)', matterId: 'EZT1006', color: 'bg-blue-500 text-white' },
    { id: 2, date: '2021-12-16', type: 'task', title: 'Signing (Wilson Doc)', matterId: 'EZT1007', color: 'bg-orange-500 text-white' },
    { id: 3, date: '2021-12-25', type: 'holiday', title: 'Christmas Day', color: 'bg-green-500 text-white' },
    { id: 4, date: '2021-12-01', type: 'deadline', title: 'Bond Grant App. Review', matterId: 'EZT1008', color: 'bg-red-500 text-white' },
    { id: 5, date: '2021-12-01', type: 'meeting', title: 'Meeting with Conveyancer', matterId: 'EZT1009', color: 'bg-purple-500 text-white' },
  ];

  // People avatars for the left column
  const people = [
    { name: 'Eddie Lobovski', email: 'eddie@email.com', avatar: '/images/avatars/face_1 (2).jpg' },
    { name: 'Alexey Sheve', email: 'alexey@email.com', avatar: '/images/avatars/face_1 (3).jpg' },
    { name: 'Anton Tlachche', email: 'anton@email.com', avatar: '/images/avatars/mock_anton.jpg' },
  ];

  // Mini calendar for left column
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
  const miniCalendarDays = generateMiniCalendarDays(currentDate);

  // Main calendar grid
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
  const calendarDays = generateCalendarDays(currentDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const displayedToday = currentDate.toISOString().substring(0,10);

  // Combine dummy events and user-created events
  const allEvents = [
    ...events,
    ...userEvents,
  ];

  return (
    <div className='flex flex-row flex-1 p-6 md:p-8 bg-gray-50 overflow-auto h-screen'>
      {/* Modal Overlay and Content */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={modalFields.title} onChange={e => setModalFields(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="flex items-center mb-3">
              <input type="checkbox" id="allDay" checked={modalFields.allDay} onChange={e => setModalFields(f => ({ ...f, allDay: e.target.checked }))} className="mr-2" />
              <label htmlFor="allDay" className="text-sm">All-day event</label>
            </div>
            <div className="flex space-x-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={modalFields.startDate}
                  onChange={e => setModalFields(f => ({ ...f, startDate: e.target.value }))}
                  placeholder="Date"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={modalFields.startTime}
                  onChange={e => setModalFields(f => ({ ...f, startTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex space-x-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={modalFields.endDate}
                  onChange={e => setModalFields(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">End Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={modalFields.endTime}
                  onChange={e => setModalFields(f => ({ ...f, endTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={modalFields.description}
                onChange={e => setModalFields(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => {
                const newEvent = {
                  id: Date.now(),
                  date: modalFields.startDate,
                  type: 'custom',
                  title: modalFields.title,
                  matterId: modalFields.matter,
                  attendees: modalFields.attendees,
                  description: modalFields.description,
                  allDay: modalFields.allDay,
                  startTime: modalFields.startTime,
                  endTime: modalFields.endTime,
                  repeats: modalFields.repeats,
                  repeatDetails: modalFields.repeatDetails,
                  color: 'bg-blue-600 text-white',
                };
                setUserEvents(evts => [...evts, newEvent]);
                setShowModal(false);
                setModalFields({ title: '', startDate: '', startTime: '', endDate: '', endTime: '', description: '', matter: '', attendees: '', allDay: false, repeats: 'None', repeatDetails: '' });
              }}>Save Event</button>
            </div>
          </div>
        </div>
      )}
      {/* Left Column */}
      <div className="w-80 flex-shrink-0 flex flex-col h-full justify-stretch">
        <div className="flex flex-col h-full space-y-6 justify-between">
          {/* Top: Create Schedule and Mini Calendar */}
          <div>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md w-full" onClick={() => setShowModal(true)}>
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
                      className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer
                        ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
                        ${day.fullDate === displayedToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => day.fullDate && setCurrentDate(new Date(day.fullDate))}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
          {/* Bottom: People Section fills remaining height */}
          <div className="flex-1 flex flex-col justify-end">
            <DashboardCard title="People" className="flex flex-col h-full">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for people"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-4 flex-1">
                {people.map((person, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{person.name}</p>
                      <p className="text-gray-500 text-xs">{person.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2 border border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition-colors">
                My Schedule
              </button>
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
                <button onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-xl font-semibold text-gray-800">
                  {currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex bg-gray-100 rounded-md p-1">
                {['Day', 'Week', 'Month', 'Year'].map(view => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
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
                className={`h-28 flex flex-col p-2 pt-1 text-sm relative group
                  ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-800'}
                  ${day.fullDate === displayedToday && day.isCurrentMonth ? 'border-2 border-blue-500 z-10 -m-px' : 'border-b border-r border-gray-200'}
                  hover:bg-blue-50 transition-colors duration-200 ease-in-out`}
              >
                <span className={`font-semibold mb-1 text-right ${day.fullDate === displayedToday && day.isCurrentMonth ? 'text-blue-600' : ''}`}>
                  {day.day}
                </span>
                <div className="flex-grow overflow-y-auto custom-scrollbar text-xs space-y-0.5">
                  {day.isCurrentMonth && allEvents
                    .filter(event => event.date === day.fullDate)
                    .map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className={`px-1 py-0 ${event.color} rounded-sm truncate cursor-pointer`}
                        title={`${event.title} (${event.matterId || 'N/A'})`}
                        style={{
                          lineHeight: '0.9rem',
                          fontSize: '0.65rem',
                        }}
                        onClick={() => alert(
                          `Title: ${event.title}\nDate: ${event.date}\nMatter: ${event.matterId || ''}\nAttendees: ${event.attendees || ''}\nDescription: ${event.description || ''}`
                        )}
                      >
                        <span className="font-medium">{event.title}</span>
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
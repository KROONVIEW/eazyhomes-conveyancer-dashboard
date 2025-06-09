import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AddTaskSimpleDrawer from '../components/tasks/AddTaskSimpleDrawer';

const initialTasks = [
  // To Do
  { id: 1, name: 'UI Design', startDate: '12/03/2021', endDate: '12/05/2021', member: 'Eddie Lobovski', status: 'Pending', isCompleted: false, priority: 'High', matterId: 'EZT1001', client: 'A. Smith' },
  { id: 2, name: 'Logo Design', startDate: '12/03/2021', endDate: '12/05/2021', member: 'Alexey Sheve', status: 'Pending', isCompleted: false, priority: 'Medium', matterId: 'EZT1002', client: 'B. Jones' },
  // Doing
  { id: 3, name: 'Graphic Design', startDate: '12/03/2021', endDate: '12/05/2021', member: 'Anton Tlachche', status: 'Running', isCompleted: false, priority: 'High', matterId: 'EZT1003', client: 'C. Brown' },
  { id: 4, name: 'Web Design', startDate: '12/03/2021', endDate: '12/05/2021', member: 'Eddie Lobovski', status: 'Running', isCompleted: false, priority: 'Low', matterId: 'EZT1004', client: 'D. Wilson' },
  // Done
  { id: 5, name: 'Logo Design', startDate: '12/01/2021', endDate: '12/03/2021', member: 'Alexey Sheve', status: 'Done', isCompleted: true, priority: 'Medium', matterId: 'EZT1005', client: 'E. Green' },
];

const statusSections = [
  { key: 'Pending', label: 'To Do', color: 'bg-orange-100 text-orange-800' },
  { key: 'Running', label: 'Doing', color: 'bg-blue-100 text-blue-800' },
  { key: 'Done', label: 'Done', color: 'bg-green-100 text-green-800' },
];

const statusTagColors = {
  Pending: 'bg-orange-100 text-orange-800',
  Running: 'bg-blue-100 text-blue-800',
  Done: 'bg-green-100 text-green-800',
};

const priorityColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-blue-100 text-blue-700',
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentView, setCurrentView] = useState('List');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedId, setCompletedId] = useState(null);
  const [timelineView, setTimelineView] = useState('Month'); // 'Day', 'Week', 'Month', 'Year'
  const [timelineDate, setTimelineDate] = useState(new Date('2021-12-01'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Simulate loading skeleton
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Inline edit handlers
  const startEdit = (id, value) => {
    setEditingId(id);
    setEditingValue(value);
  };
  const saveEdit = (id) => {
    setTasks(tasks => tasks.map(task => task.id === id ? { ...task, name: editingValue } : task));
    setEditingId(null);
    setEditingValue('');
  };

  // Checkbox with micro-interaction
  const handleCheck = (id) => {
    setCompletedId(id);
    setTasks(tasks => tasks.map(task => task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    setTimeout(() => setCompletedId(null), 600);
  };

  // Delete with error toast
  const handleDelete = (id) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    setError('Task deleted');
    setTimeout(() => setError(''), 2000);
  };

  // Filtering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.member.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Helper: get all filtered tasks with valid dates
  const timelineTasks = filteredTasks.map(t => ({
    ...t,
    start: new Date(t.startDate.split('/').reverse().join('-')),
    end: new Date(t.endDate.split('/').reverse().join('-')),
  })).sort((a, b) => a.start - b.start);

  // Helper: get timeline range (for Month view)
  function getTimelineRange(view, date) {
    if (view === 'Month') {
      const year = date.getFullYear();
      const month = date.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      return { start: first, end: last };
    }
    // Add more granularities as needed
    return { start: date, end: date };
  }
  const { start: rangeStart, end: rangeEnd } = getTimelineRange(timelineView, timelineDate);
  // Generate days for Month view
  const daysInMonth = [];
  if (timelineView === 'Month') {
    for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      daysInMonth.push(new Date(d));
    }
  }

  // Timeline navigation handlers
  const handlePrev = () => {
    if (timelineView === 'Month') {
      setTimelineDate(new Date(timelineDate.getFullYear(), timelineDate.getMonth() - 1, 1));
    }
  };
  const handleNext = () => {
    if (timelineView === 'Month') {
      setTimelineDate(new Date(timelineDate.getFullYear(), timelineDate.getMonth() + 1, 1));
    }
  };
  const handleToday = () => {
    setTimelineDate(new Date());
  };

  // Empty state illustration
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#F3F4F6"/><path d="M24 56h32M28 32h24M32 40h16" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/></svg>
      <p className="mt-4 text-gray-400 text-lg">No tasks yet!</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col p-0 m-0">
      <div className="flex flex-1 h-full w-full justify-center items-start">
        <DashboardCard className="flex-1 flex flex-col w-full max-w-7xl h-full p-0 m-0 rounded-none border-none shadow-none bg-gray-50">
          {/* Error Toast */}
          {error && <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">{error}</div>}
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pt-6 px-0 min-w-0">
            <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Task Preview</h2>
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex bg-gray-100 rounded-md p-1 min-w-0">
                {['List', 'Board', 'Timeline'].map(view => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-4 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                      currentView === view ? 'bg-white shadow text-blue-600' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label={`Switch to ${view} view`}
                  >
                    {view}
                  </button>
                ))}
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md" onClick={() => setDrawerOpen(true)}>
                <PlusIcon className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-4 px-0 min-w-0">
            <span className="text-gray-500 text-sm">Filter:</span>
            {['All', ...statusSections.map(s => s.key)].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  filterStatus === status ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status === 'All' ? 'All Statuses' : statusSections.find(s => s.key === status)?.label || status}
              </button>
            ))}
            {['All', 'High', 'Medium', 'Low'].map(priority => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  filterPriority === priority ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {priority === 'All' ? 'All Priorities' : priority}
              </button>
            ))}
          </div>
          {/* Search Bar */}
          <div className="relative mb-8 max-w-md px-0 min-w-0">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="block w-full pl-4 pr-10 py-2 border border-gray-200 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search tasks"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {/* Task Sections */}
          <div className="flex-1 min-h-0 overflow-y-auto px-0 pb-6 min-w-0">
            <div className="w-full overflow-x-auto min-w-0">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                  <div className="w-2/3 h-8 bg-gray-100 rounded mb-6" />
                  <div className="w-full h-16 bg-gray-100 rounded mb-4" />
                  <div className="w-full h-16 bg-gray-100 rounded mb-4" />
                  <div className="w-full h-16 bg-gray-100 rounded" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <EmptyState />
              ) : currentView === 'List' ? (
                <div className="space-y-10 min-w-[900px]">
                  {statusSections.map(section => (
                    <div key={section.key}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-700">{section.label}</h3>
                        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">See More</a>
                      </div>
                      {/* Table Headers */}
                      <div className="grid grid-cols-8 gap-2 px-2 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100 text-xs font-medium text-gray-500">
                        <div>Check Box</div>
                        <div>Task Name</div>
                        <div>Matter</div>
                        <div>Start Date</div>
                        <div>End Date</div>
                        <div>Member</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      {/* Task Rows */}
                      <div className="divide-y divide-gray-100 bg-white rounded-b-lg">
                        {filteredTasks.filter(task => task.status === section.key).map(task => (
                          <div
                            key={task.id}
                            className={`grid grid-cols-8 gap-2 px-2 py-3 items-center group hover:bg-blue-50 transition-all duration-200 focus-within:bg-blue-50`}
                            tabIndex={0}
                          >
                            {/* Checkbox with micro-interaction */}
                            <div>
                              <button
                                aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                onClick={() => handleCheck(task.id)}
                                className={`focus:outline-none`}
                              >
                                {task.isCompleted || completedId === task.id ? (
                                  <CheckCircleIcon className={`h-5 w-5 text-green-500 transition-all duration-200 scale-110`} />
                                ) : (
                                  <span className="inline-block w-5 h-5 border-2 border-gray-300 rounded-full bg-white group-hover:border-blue-400 transition-all duration-200" />
                                )}
                              </button>
                            </div>
                            {/* Task Name with inline editing */}
                            <div className="flex items-center gap-2">
                              {editingId === task.id ? (
                                <input
                                  value={editingValue}
                                  onChange={e => setEditingValue(e.target.value)}
                                  onBlur={() => saveEdit(task.id)}
                                  onKeyDown={e => e.key === 'Enter' && saveEdit(task.id)}
                                  className="border-b border-blue-400 bg-blue-50 px-1 py-0.5 rounded text-sm focus:outline-none"
                                  autoFocus
                                  aria-label="Edit task name"
                                />
                              ) : (
                                <>
                                  <a
                                    href="#"
                                    className="text-blue-600 hover:underline font-medium text-sm"
                                    tabIndex={0}
                                    onDoubleClick={() => startEdit(task.id, task.name)}
                                    aria-label={`Task: ${task.name}`}
                                  >
                                    {task.name}
                                  </a>
                                  <span className="ml-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-500">{task.client}</span>
                                </>
                              )}
                            </div>
                            {/* Matter/Tag */}
                            <div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-xs text-blue-700 font-medium border border-blue-100">
                                <span className="mr-1">🏠</span>{task.matterId}
                              </span>
                            </div>
                            {/* Start Date */}
                            <div className="text-gray-700 text-sm">{task.startDate}</div>
                            {/* End Date */}
                            <div className="text-red-500 text-sm">{task.endDate}</div>
                            {/* Member */}
                            <div className="text-gray-700 text-sm">{task.member}</div>
                            {/* Status Tag */}
                            <div>
                              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusTagColors[task.status] || 'bg-gray-100 text-gray-800'}`}>{task.status}</span>
                            </div>
                            {/* Actions: contextual menu */}
                            <div className="flex items-center justify-end gap-2 relative">
                              <button
                                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                                title="Edit"
                                onClick={() => startEdit(task.id, task.name)}
                                aria-label="Edit task"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                                title="Delete"
                                onClick={() => handleDelete(task.id)}
                                aria-label="Delete task"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                              <div className="relative">
                                <button
                                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                                  onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
                                  aria-label="More actions"
                                >
                                  <EllipsisVerticalIcon className="h-4 w-4" />
                                </button>
                                {showMenu === task.id && (
                                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10 animate-fade-in">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setShowMenu(null); handleCheck(task.id); }}>Complete Task</button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setShowMenu(null); /* Share logic */ }}>Share Task</button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setShowMenu(null); /* Duplicate logic */ }}>Duplicate</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              {currentView === 'Board' && (
                <div className="text-center text-gray-500 py-20">Board View under construction.</div>
              )}
              {currentView === 'Timeline' && (
                <div className="flex flex-col gap-4 min-h-[500px]">
                  {/* Timeline Controls */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button onClick={handlePrev} className="p-2 rounded hover:bg-gray-100"><ChevronLeftIcon className="h-5 w-5" /></button>
                      <span className="font-semibold text-gray-700">
                        {timelineDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button onClick={handleNext} className="p-2 rounded hover:bg-gray-100"><ChevronRightIcon className="h-5 w-5" /></button>
                      <button onClick={handleToday} className="ml-2 px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200">Today</button>
                    </div>
                    <div className="flex bg-gray-100 rounded-md p-1">
                      {['Day', 'Week', 'Month', 'Year'].map(view => (
                        <button
                          key={view}
                          onClick={() => setTimelineView(view)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${timelineView === view ? 'bg-white shadow text-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                          {view}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Timeline Main Area */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden h-[400px] bg-white">
                    {/* Left Pane: Task List */}
                    <div className="w-1/4 min-w-[180px] bg-white border-r border-gray-100 overflow-y-auto">
                      {timelineTasks.length === 0 ? (
                        <div className="text-gray-400 text-center py-10">No tasks for this period.</div>
                      ) : (
                        timelineTasks.map((task, idx) => (
                          <div key={task.id} className="px-4 py-3 border-b border-gray-50 text-sm flex flex-col gap-1">
                            <span className="font-medium text-gray-800 truncate">{task.name}</span>
                            <span className="text-xs text-blue-600">{task.matterId}</span>
                          </div>
                        ))
                      )}
                    </div>
                    {/* Right Pane: Timeline Grid */}
                    <div className="flex-1 relative overflow-x-auto overflow-y-auto">
                      {/* Time Grid Header */}
                      <div className="flex sticky top-0 z-10 bg-white border-b border-gray-100">
                        {daysInMonth.map((d, i) => (
                          <div key={i} className="w-16 text-xs text-center py-2 border-l border-gray-100 first:border-l-0">
                            {d.getDate()}
                          </div>
                        ))}
                      </div>
                      {/* Task Bars */}
                      <div className="relative" style={{ height: `${timelineTasks.length * 48}px` }}>
                        {timelineTasks.map((task, rowIdx) => {
                          // Calculate left/width for Month view
                          const totalDays = daysInMonth.length;
                          const startIdx = Math.max(0, Math.floor((task.start - rangeStart) / (1000 * 60 * 60 * 24)));
                          const endIdx = Math.min(totalDays - 1, Math.floor((task.end - rangeStart) / (1000 * 60 * 60 * 24)));
                          const left = startIdx * 64; // 16rem per day
                          const width = Math.max(64, (endIdx - startIdx + 1) * 64);
                          let barColor = 'bg-yellow-500';
                          if (task.status === 'Running') {barColor = 'bg-blue-500';}
                          if (task.status === 'Done') {barColor = 'bg-green-500';}
                          // Overdue
                          if (task.status !== 'Done' && task.end < new Date()) {barColor = 'bg-red-500';}
                          return (
                            <div
                              key={task.id}
                              className={`absolute top-0 left-0 h-8 rounded-md text-white text-xs flex items-center px-2 shadow ${barColor}`}
                              style={{
                                top: rowIdx * 48 + 8,
                                left,
                                width,
                                minWidth: 64,
                                zIndex: 2,
                                cursor: 'pointer',
                                transition: 'box-shadow 0.2s',
                              }}
                              title={`${task.name} (${task.matterId})\n${task.startDate} - ${task.endDate}`}
                              onClick={() => alert(`Task: ${task.name}\n${task.startDate} - ${task.endDate}`)}
                            >
                              <span className="truncate">{task.name}</span>
                            </div>
                          );
                        })}
                        {/* Row lines */}
                        {timelineTasks.map((_, rowIdx) => (
                          <div
                            key={rowIdx}
                            className="absolute left-0 w-full border-t border-gray-50"
                            style={{ top: rowIdx * 48 + 48 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DashboardCard>
      </div>
      {/* Only render AddTaskDrawer when drawerOpen is true */}
      {drawerOpen && (
        <AddTaskSimpleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
};

export default TasksPage; 
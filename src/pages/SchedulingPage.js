import React, { useState } from 'react';
// import DashboardCard from '../components/DashboardCard'; // Temporarily remove for testing
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AddTaskDrawer from '../components/tasks/AddTaskDrawer';

const SchedulingPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, matter: 'T#1001 (123 Main St)', task: 'Draft Deed of Sale', assignedTo: 'John Doe', deadline: '2025-06-07', status: 'Pending' },
    { id: 2, matter: 'T#1002 (456 Elm St)', task: 'Request FICA Docs (Buyer)', assignedTo: 'Jane Smith', deadline: '2025-06-03', status: 'Overdue' },
    { id: 3, matter: 'T#1003 (789 Pine Ln)', task: 'Liaise with Bank for Bond Approval', assignedTo: 'John Doe', deadline: '2025-06-15', status: 'In Progress' },
    { id: 4, matter: 'T#1004 (101 Cedar Rd)', task: 'Prepare Transfer Duty Declaration', assignedTo: 'Alice B.', deadline: '2025-06-12', status: 'Completed' },
    { id: 5, matter: 'T#1005 (22 Willow Dr)', task: 'Send Welcome Pack', assignedTo: 'Jane Smith', deadline: '2025-06-10', status: 'Pending' },
    { id: 6, matter: 'T#1006 (88 Maple Ave)', task: 'Schedule Inspection', assignedTo: 'John Doe', deadline: '2025-06-11', status: 'In Progress' },
    { id: 7, matter: 'T#1007 (14 Birch Rd)', task: 'Draft Power of Attorney', assignedTo: 'Alice B.', deadline: '2025-06-13', status: 'Pending' },
    { id: 8, matter: 'T#1008 (77 Oak St)', task: 'Obtain Clearance Certificate', assignedTo: 'Jane Smith', deadline: '2025-06-14', status: 'Completed' },
    { id: 9, matter: 'T#1009 (9 Cedar Ave)', task: 'Confirm Bond Approval', assignedTo: 'John Doe', deadline: '2025-06-16', status: 'Pending' },
    { id: 10, matter: 'T#1010 (31 Pine St)', task: 'Send Invoice', assignedTo: 'Alice B.', deadline: '2025-06-17', status: 'Overdue' },
    { id: 11, matter: 'T#1011 (45 Spruce Ln)', task: 'Review Title Deed', assignedTo: 'Jane Smith', deadline: '2025-06-18', status: 'In Progress' },
    { id: 12, matter: 'T#1012 (63 Elm St)', task: 'Arrange Courier', assignedTo: 'John Doe', deadline: '2025-06-19', status: 'Pending' },
    { id: 13, matter: 'T#1013 (12 Oak Ave)', task: 'Draft Sale Agreement', assignedTo: 'Alice B.', deadline: '2025-06-20', status: 'Completed' },
    { id: 14, matter: 'T#1014 (99 Maple Dr)', task: 'Collect FICA Docs', assignedTo: 'Jane Smith', deadline: '2025-06-21', status: 'Pending' },
    { id: 15, matter: 'T#1015 (18 Willow Rd)', task: 'Schedule Key Handover', assignedTo: 'John Doe', deadline: '2025-06-22', status: 'In Progress' },
    { id: 16, matter: 'T#1016 (27 Birch St)', task: 'Send Payment Reminder', assignedTo: 'Alice B.', deadline: '2025-06-23', status: 'Pending' },
    { id: 17, matter: 'T#1017 (56 Cedar Ln)', task: 'Update Client Portal', assignedTo: 'Jane Smith', deadline: '2025-06-24', status: 'Completed' },
    { id: 18, matter: 'T#1018 (81 Pine Ave)', task: 'Confirm Transfer Duty', assignedTo: 'John Doe', deadline: '2025-06-25', status: 'Pending' },
    { id: 19, matter: 'T#1019 (33 Spruce Rd)', task: 'Draft Mandate', assignedTo: 'Alice B.', deadline: '2025-06-26', status: 'Overdue' },
    { id: 20, matter: 'T#1020 (50 Oak St)', task: 'Send Final Statement', assignedTo: 'Jane Smith', deadline: '2025-06-27', status: 'Pending' },
    { id: 21, matter: 'T#1021 (61 Maple Ave)', task: 'Arrange Registration', assignedTo: 'John Doe', deadline: '2025-06-28', status: 'In Progress' },
    { id: 22, matter: 'T#1022 (72 Willow Dr)', task: 'Confirm Occupation Date', assignedTo: 'Alice B.', deadline: '2025-06-29', status: 'Completed' },
    { id: 23, matter: 'T#1023 (83 Birch Rd)', task: 'Send Welcome Email', assignedTo: 'Jane Smith', deadline: '2025-06-30', status: 'Pending' },
    { id: 24, matter: 'T#1024 (94 Cedar Ave)', task: 'Draft Addendum', assignedTo: 'John Doe', deadline: '2025-07-01', status: 'Pending' },
    { id: 25, matter: 'T#1025 (105 Pine St)', task: 'Review Bond Documents', assignedTo: 'Alice B.', deadline: '2025-07-02', status: 'In Progress' },
  ]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' || task.status === filter;
    const matchesSearch = task.matter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='w-full h-full flex flex-col bg-gray-50 overflow-auto p-4 md:p-6'>
      {/* Header: Full width by default. */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800">Task Scheduling</h1>
        <div className="flex space-x-3">
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
              onClick={() => setDrawerOpen(true)}
            >
                <PlusIcon className="h-5 w-5"/>
                <span>Add New Task</span>
            </button>
        </div>
      </div>

      {/* Content Wrapper: Mimics a card, takes remaining height, full width, and handles overflow. */}
      <div className="flex-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col overflow-hidden">
        {/* Filters section: Full width, with internal padding. */}
        <div className="p-6 pb-4 border-b border-gray-200 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              {['All', 'Pending', 'In Progress', 'Completed', 'Overdue'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table section: Takes remaining height in this "card", full width, and scrolls internally. */}
        <div className="flex-1 w-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline">{task.matter}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.task}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.deadline}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-600 hover:text-blue-600 mr-3"><PencilIcon className="h-5 w-5"/></button>
                    <button className="text-gray-600 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                  <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No tasks found matching your criteria.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {drawerOpen && (
        <AddTaskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
};

export default SchedulingPage; 
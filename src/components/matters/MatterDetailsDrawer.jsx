import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ProgressBar from "./ProgressBar";
import StatusTag from "./StatusTag";
import Checklist from "./Checklist";
import DocumentList from "./DocumentList";
import ActivityFeed from "./ActivityFeed";
import TaskTimeline from "./TaskTimeline";

const checklistData = [
  { id: 1, label: "Offer to Purchase signed", done: true },
  { id: 2, label: "FICA documents uploaded", done: false },
  { id: 3, label: "Power of Attorney received", done: false },
  { id: 4, label: "Clearance Certificate requested", done: false },
  { id: 5, label: "Deeds Office Lodged", done: false }
];

const activityData = [
  { id: 1, text: "Thuli M. uploaded FICA.pdf", date: "2025-05-30T10:30:00Z" },
  { id: 2, text: "Checklist updated: Offer to Purchase signed", date: "2025-05-29T09:00:00Z" },
  { id: 3, text: "Client note added: Awaiting bank clearance", date: "2025-05-28T15:45:00Z" },
];

const tabs = ["Overview", "Checklist", "Documents", "Activity Log"];

const MatterDetailsDrawer = ({ open, onClose, matter }) => {
  const [tab, setTab] = useState("Overview");
  if (!matter) {return null;}
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl flex flex-col">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-white p-6 border-b flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg text-blue-800">{matter.address}</div>
                    <div className="text-xs text-gray-400">{matter.id}</div>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StatusTag status={matter.status} />
                  <div className="flex-1 max-w-xs"><ProgressBar progress={matter.progress} /></div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{matter.assignedTo}</span>
                </div>
                {/* Tabs */}
                <div className="flex gap-6 mt-4 border-b">
                  {tabs.map(t => (
                    <button
                      key={t}
                      className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${tab === t ? "border-purple-600 text-purple-700" : "border-transparent text-gray-500 hover:text-purple-600"}`}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {tab === "Overview" && (
                  <table className="w-full text-sm">
                    <tbody>
                      <tr><td className="font-semibold text-gray-700 py-2">Property Address</td><td>{matter.address}</td></tr>
                      <tr><td className="font-semibold text-gray-700 py-2">Buyer</td><td>{matter.client}</td></tr>
                      <tr><td className="font-semibold text-gray-700 py-2">Bank</td><td>Standard Bank</td></tr>
                      <tr><td className="font-semibold text-gray-700 py-2">Transfer Type</td><td>{matter.type}</td></tr>
                      <tr><td className="font-semibold text-gray-700 py-2">Mandate Date</td><td>2025-05-01</td></tr>
                      <tr><td className="font-semibold text-gray-700 py-2">Registrar Office</td><td>Johannesburg</td></tr>
                    </tbody>
                  </table>
                )}
                {tab === "Checklist" && (
                  <>
                    <TaskTimeline />
                    <Checklist initialItems={checklistData} />
                  </>
                )}
                {tab === "Documents" && (
                  <DocumentList />
                )}
                {tab === "Activity Log" && (
                  <ActivityFeed items={activityData} />
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MatterDetailsDrawer; 
import React, { useState } from 'react';
import Layout from '../components/Layout';
import FiltersBar from '../components/matters/FiltersBar';
import MatterList from '../components/matters/MatterList';
import MatterDetailsDrawer from '../components/matters/MatterDetailsDrawer';
import NewMatterDrawer from '../components/matters/NewMatterDrawer';

const dummyMatters = [
  {
    id: "MAT-20394",
    client: "Lindiwe Nkosi",
    address: "12 Oak Avenue, Sandton",
    status: "Awaiting Signature",
    progress: 60,
    stage: "Awaiting Bank Clearance",
    assignedTo: "Thuli M.",
    updatedAt: "2025-05-30T10:23:00Z",
    type: "Sectional Title"
  },
  {
    id: "MAT-20395",
    client: "Sipho Dlamini",
    address: "34 Pine Lane, Pretoria",
    status: "In Progress",
    progress: 30,
    stage: "Offer to Purchase",
    assignedTo: "Kabelo S.",
    updatedAt: "2025-05-29T15:10:00Z",
    type: "Freehold"
  },
  {
    id: "MAT-20396",
    client: "Fatima Patel",
    address: "56 Main Road, Cape Town",
    status: "Registered",
    progress: 100,
    stage: "Final Registration",
    assignedTo: "Thuli M.",
    updatedAt: "2025-05-28T09:00:00Z",
    type: "Bond Cancellation"
  },
  {
    id: "MAT-20397",
    client: "Johan van der Merwe",
    address: "78 Market St, Bloemfontein",
    status: "Delayed",
    progress: 40,
    stage: "FICA Complete",
    assignedTo: "Kabelo S.",
    updatedAt: "2025-05-27T14:30:00Z",
    type: "Estate"
  },
];

const MattersPage = () => {
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newMatterOpen, setNewMatterOpen] = useState(false);

  const handleRowClick = (matter) => {
    setSelectedMatter(matter);
    setDrawerOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-2 md:px-0 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Matters</h1>
            <div className="text-gray-500 text-sm mt-1">All active transfers, sorted by status and progress</div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition" onClick={() => setNewMatterOpen(true)}>
            + New Matter
          </button>
        </div>
        {/* Filters */}
        <FiltersBar />
        {/* Matter List */}
        <MatterList matters={dummyMatters} onRowClick={handleRowClick} />
        {/* Drawers */}
        <MatterDetailsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} matter={selectedMatter} />
        <NewMatterDrawer open={newMatterOpen} onClose={() => setNewMatterOpen(false)} onNext={() => setNewMatterOpen(false)} />
      </div>
    </Layout>
  );
};

export default MattersPage; 
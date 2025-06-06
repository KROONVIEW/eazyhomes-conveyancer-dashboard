import React from 'react';
import { useMatters } from '../hooks/useMatters';
import TransactionCard from '../components/TransactionCard';

export default function OverviewPage() {
  const { matters, loading, error } = useMatters();

  // Handlers for card actions (stubbed for now)
  const handleViewDetails = (id) => {
    // TODO: Navigate to /matter/:id/details
    alert(`View details for matter ${id}`);
  };
  const handleViewTimeline = (id) => {
    // TODO: Open timeline modal or navigate
    alert(`View timeline for matter ${id}`);
  };
  const handleAttorneyClick = (attorneyId) => {
    // TODO: Open attorney profile or chat
    alert(`Open profile for attorney ${attorneyId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      {loading && (
        <div className="text-gray-500">Loading matters...</div>
      )}
      {error && (
        <div className="text-red-600">{error}</div>
      )}
      {!loading && !error && matters.length === 0 && (
        <div className="text-gray-500">No matters found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matters.map(matter => (
          <TransactionCard
            key={matter.id}
            matter={matter}
            onViewDetails={handleViewDetails}
            onViewTimeline={handleViewTimeline}
            onAttorneyClick={handleAttorneyClick}
          />
        ))}
      </div>
    </div>
  );
} 
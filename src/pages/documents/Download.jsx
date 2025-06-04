import React from 'react';
import DashboardCard from '../../components/DashboardCard';
import DownloadTemplateGrid from '../../components/DownloadTemplateGrid.tsx';
import templatesData from '../../mock/templatesData.ts';

const Download = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardCard title="Download Templates">
        <DownloadTemplateGrid
          templates={templatesData}
          onDownload={t => alert('Download: ' + t.name)}
        />
        {/* Empty State for templates */}
        {templatesData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#F3F4F6"/><path d="M24 56h32M28 32h24M32 40h16" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round"/></svg>
            <p className="mt-4 text-gray-400 text-lg">No templates found.</p>
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default Download; 
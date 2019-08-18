import * as React from 'react';
import RecentlyUpdatedDeets from 'client/dashboard/RecentlyUpdatedDeets';
import UpcomingBirthdays from 'client/dashboard/UpcomingBirthdays';
import Todos from 'client/dashboard/Todos';

function DashboardPage() {
  return (
    <div className="dashboard-page-wrapper">
      <Todos />
      <RecentlyUpdatedDeets />
      <UpcomingBirthdays />
      <style jsx>{`
        .dashboard-page-wrapper {
          padding: 30px;
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;

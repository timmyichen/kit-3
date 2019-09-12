import * as React from 'react';
import RecentlyUpdatedDeets from 'client/dashboard/RecentlyUpdatedDeets';
import UpcomingBirthdays from 'client/dashboard/UpcomingBirthdays';
import Todos from 'client/dashboard/Todos';
import Meta from 'client/components/Meta';

function DashboardPage() {
  return (
    <div className="dashboard-page-wrapper">
      <Meta title="Dashboard" />
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

import * as React from 'react';
import { Header } from 'semantic-ui-react';
import RecentlyUpdatedDeets from 'client/dashboard/RecentlyUpdatedDeets';
import UpcomingBirthdays from 'client/dashboard/UpcomingBirthdays';
import Todos from 'client/dashboard/Todos';

function DashboardPage() {
  return (
    <div className="dashboard-page-wrapper">
      <Header as="h1">Keep in Touch</Header>
      <div>
        <Todos />
        <RecentlyUpdatedDeets />
        <UpcomingBirthdays />
      </div>
      <style jsx>{`
        .dashboard-page-wrapper {
          padding: 30px;
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;

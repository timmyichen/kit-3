import * as React from 'react';
import CurrentUserDeets from './CurrentUserDeets';
import DeetCreator from './DeetCreator';

export default function DeetDashboard() {
  return (
    <div className="deets-dashboard">
      <DeetCreator />
      <CurrentUserDeets />
    </div>
  );
}

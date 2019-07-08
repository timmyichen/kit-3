import * as React from 'react';
import DeetCreator from './DeetCreator';
import CurrentUserDeets from './CurrentUserDeets';

export default function DeetDashboard() {
  return (
    <div className="deets-dashboard">
      <DeetCreator />
      <CurrentUserDeets />
      <style jsx>{`
        .deets-dashboard {
        }
      `}</style>
    </div>
  );
}

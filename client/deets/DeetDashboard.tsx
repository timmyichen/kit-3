import * as React from 'react';
import CurrentUserDeets from './CurrentUserDeets';

export default function DeetDashboard() {
  return (
    <div className="deets-dashboard">
      <CurrentUserDeets />
      <style jsx>{`
        .deets-dashboard {
        }
      `}</style>
    </div>
  );
}

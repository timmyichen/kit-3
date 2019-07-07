import * as React from 'react';
import ContactInfoCreator from './ContactInfoCreator';

export default function ContactInfoDashboard() {
  return (
    <div className="contacts-dashboard">
      <ContactInfoCreator />
      <style jsx>{`
        .contacts-dashboard {
        }
      `}</style>
    </div>
  );
}

import * as React from 'react';
import ContactInfoCreator from './ContactInfoCreator';
import CurrentUserDeets from './CurrentUserDeets';

export default function ContactInfoDashboard() {
  return (
    <div className="contacts-dashboard">
      <ContactInfoCreator />
      <CurrentUserDeets />
      <style jsx>{`
        .contacts-dashboard {
        }
      `}</style>
    </div>
  );
}

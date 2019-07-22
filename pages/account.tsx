import * as React from 'react';
import UserUpdateForm from 'client/account/UserUpdateForm';

export default () => {
  return (
    <div className="account-page-wrapper">
      <UserUpdateForm />
      <style jsx>{`
        .account-page-wrapper {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

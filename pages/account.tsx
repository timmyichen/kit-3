import * as React from 'react';
import UserUpdateForm from 'client/account/UserUpdateForm';
import NewPasswordForm from 'client/account/NewPasswordForm';
import ProfilePictureUpdater from 'client/account/ProfilePictureUpdater';

export default () => {
  return (
    <div className="account-page-wrapper">
      <UserUpdateForm />
      <NewPasswordForm />
      <ProfilePictureUpdater />
      <style jsx>{`
        .account-page-wrapper {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

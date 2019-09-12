import * as React from 'react';
import UserUpdateForm from 'client/account/UserUpdateForm';
import NewPasswordForm from 'client/account/NewPasswordForm';
import ProfilePictureUpdater from 'client/account/ProfilePictureUpdater';
import Meta from 'client/components/Meta';

export default () => {
  return (
    <div className="account-page-wrapper">
      <Meta title="Account Management" />
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

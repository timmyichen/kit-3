import * as React from 'react';
import UserIcon from 'client/svg/UserIcon';

export default function ProfileImage({
  profileImageUrl,
  width,
  height,
  style,
}: {
  profileImageUrl: string | null | undefined;
  width?: number;
  height?: number;
  style?: { [k: string]: string | number };
}) {
  const w = width || 200;
  const h = height || 200;

  return (
    <div className="profile-image-wrapper" style={style}>
      {profileImageUrl ? <div className="image" /> : <UserIcon />}
      <style jsx>{`
        .profile-image-wrapper .image,
        .profile-image-wrapper :global(.user-svg-icon) {
          width: 100%;
          height: 100%;
          border-radius: 1000px;
          box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
        }
        .image {
          background-image: url(${profileImageUrl});
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center center;
        }
        .profile-image-wrapper {
          width: ${w}px;
          height: ${h}px;
        }
      `}</style>
    </div>
  );
}

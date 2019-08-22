import * as React from 'react';
import { useCtxState } from 'client/components/ContextProvider';
import useMessages from 'client/hooks/useMessages';
import {
  useUpdateProfilePictureMutation,
  useUserProfileByUsernameQuery,
} from 'generated/generated-types';
import { Button, Header } from 'semantic-ui-react';
import Loader from 'client/components/Loader';

function isFileRefInvalid(ref: React.RefObject<HTMLInputElement>) {
  return (
    !ref.current ||
    !ref.current.validity ||
    !ref.current.files ||
    !ref.current.files[0]
  );
}

function validateFile(ref: React.RefObject<HTMLInputElement>) {
  const file = (ref.current!.files as FileList)[0];

  if (!file.type.startsWith('image')) {
    return { ok: false, message: 'Invalid file type - must be an image' };
  }

  if (file.size > 1 * 1024 * 1024) {
    return { ok: false, message: 'Must be 1MB or less' };
  }

  return { ok: true, message: '' };
}

function ProfilePictureUpdater() {
  const { currentUser } = useCtxState();

  const { data } = useUserProfileByUsernameQuery({
    variables: {
      username: currentUser ? currentUser.username : '',
    },
  });

  const { showError, showConfirm } = useMessages({ length: 4000 });
  const [imageData, setImageData] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!data || !data.userByUsername || !data.userByUsername.profilePicture) {
      return;
    }

    setImageData(data.userByUsername.profilePicture);
  }, [data]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateProfilePicture = useUpdateProfilePictureMutation();

  const onClick = async () => {
    if (isFileRefInvalid(fileInputRef)) {
      return;
    }

    const { ok, message } = validateFile(fileInputRef);

    if (!ok) {
      return showError(message);
    }

    const file = (fileInputRef.current!.files as FileList)[0];

    setLoading(true);

    try {
      await updateProfilePicture({ variables: { file } });
    } catch (e) {
      showError(e.message);
      return setLoading(false);
    }

    setLoading(false);
    showConfirm('Profile picture updated');
  };

  const onLoadFile = () => {
    if (isFileRefInvalid(fileInputRef)) {
      return;
    }

    const { ok, message } = validateFile(fileInputRef);

    if (!ok) {
      return showError(message);
    }

    const file = (fileInputRef.current!.files as FileList)[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      setImageData(reader.result as string);
    };
    reader.onerror = function(error) {
      showError('Error in loading image: ' + error);
    };
  };

  return (
    <div className="user-update-propic-wrapper">
      <Header as="h1">Update Profile Picture</Header>
      <div className="image">
        {loading && (
          <>
            <div className="overlay" />
            <div className="loader-wrapper">
              <Loader />
            </div>
          </>
        )}
        {imageData && <img src={imageData} />}
      </div>
      <div className="input-wrapper">
        <input
          value={undefined}
          type="file"
          ref={fileInputRef}
          onChange={onLoadFile}
        />
      </div>
      <div className="controls">
        <Button disabled={loading} positive onClick={onClick}>
          Save
        </Button>
      </div>
      <style jsx>{`
        .user-update-propic-wrapper {
          padding-top: 30px;
          max-width: 400px;
          margin: 0 auto;
        }
        img {
          width: 200px;
          height: 200px;
          min-width: 200px;
          border-radius: 100px;
        }
        .image {
          width: 200px;
          margin: 0 auto;
        }
        .input-wrapper,
        .image {
          text-align: center;
          position: relative;
        }
        .input-wrapper,
        .controls {
          margin-top: 20px;
        }
        .loader-wrapper {
          position: absolute;
          top: calc(50% - 25px);
          left: 50%;
          z-index: 100;
        }
        .overlay {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          border-radius: 100px;
          background-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

export default ProfilePictureUpdater;

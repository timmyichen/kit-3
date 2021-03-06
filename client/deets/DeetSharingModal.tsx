import * as React from 'react';
import { Modal, Header, Button, Checkbox } from 'semantic-ui-react';
import { Deet, Friend } from 'client/types';
import CtxModal, { closeModal } from 'client/components/Modal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import Loader from 'client/components/Loader';
import {
  useUpdateSharedPermissionsMutation,
  useDeetPermsQuery,
} from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';

interface Props {
  deet: Deet;
}

interface Permission {
  userId: number;
  permitted: boolean;
}

const DeetSharingModal = ({ deet }: Props) => {
  const dispatch = useCtxDispatch();
  const { showError, showConfirm } = useMessages({ length: 4000 });
  const [saving, setSaving] = React.useState<boolean>(false);
  // const [search, setSearch] = React.useState<string>('');
  const [search] = React.useState<string>('');
  const [changedPerms, setChangedPerms] = React.useState<Array<Permission>>([]);
  const updateSharingPermissions = useUpdateSharedPermissionsMutation();
  const { data, loading } = useDeetPermsQuery({
    variables: {
      searchQuery: search,
      count: 20,
      after: null,
      deetId: deet.id,
    },
  });

  const onSave = async () => {
    setSaving(true);
    try {
      await updateSharingPermissions({
        variables: {
          deetId: deet.id,
          userIdsToAdd: changedPerms
            .filter(p => p.permitted)
            .map(p => p.userId),
          userIdsToRemove: changedPerms
            .filter(p => !p.permitted)
            .map(p => p.userId),
        },
      });
    } catch (e) {
      setSaving(false);
      return showError(e.message);
    }
    showConfirm('Updated sharing settings');
    closeModal(dispatch);
  };

  const setPerm = ({ userId, permitted }: Permission) => {
    const newPerms = [...changedPerms];
    const changeIndex = newPerms.findIndex(p => p.userId === userId);
    if (changeIndex > -1) {
      newPerms.splice(changeIndex, 1);
    } else {
      newPerms.push({ userId, permitted });
    }
    setChangedPerms(newPerms);
  };

  return (
    <CtxModal size="tiny" closeOnDimmerClick={false}>
      <Header icon="users" content="Sharing Settings" />
      <Modal.Content>
        <h3>Sharing settings for {deet.label}</h3>
      </Modal.Content>
      <Modal.Content>
        {loading || !data || !data.friends || !data.friends.items ? (
          <Loader />
        ) : (
          <div className="friend-share-wrapper">
            {data.friends.items.map((friend: Friend) => {
              let hasAccessToDeet = friend.hasAccessToDeet;
              const change = changedPerms.find(p => p.userId === friend.id);
              if (change) {
                hasAccessToDeet = change.permitted;
              }

              return (
                <FriendShareItem
                  key={`friend-share-item-${friend.id}`}
                  friend={{ ...friend, hasAccessToDeet }}
                  setPerm={setPerm}
                />
              );
            })}
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <div className="ctas">
          <Button onClick={() => closeModal(dispatch)}>Cancel</Button>
          <Button color="green" disabled={saving} onClick={onSave}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Modal.Actions>
      <style jsx>{`
        .ctas {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media only screen and (max-width: 767px) {
          .ctas {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </CtxModal>
  );
};

function FriendShareItem({
  friend,
  setPerm,
}: {
  friend: Friend;
  setPerm(p: Permission): void;
}) {
  return (
    <div className="friend-share-wrapper">
      <div className="user">
        {friend.fullName} ({friend.username})
      </div>
      <div className="toggler">
        <Checkbox
          toggle
          checked={friend.hasAccessToDeet}
          onClick={() =>
            setPerm({ userId: friend.id, permitted: !friend.hasAccessToDeet })
          }
        />
      </div>
      <style jsx>{`
        .friend-share-wrapper {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}

export default DeetSharingModal;

import * as React from 'react';
import { Modal, Header, Button, Loader, Checkbox } from 'semantic-ui-react';
import { Deet, User } from 'client/types';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { UPDATE_SHARED_PERMISSIONS_MUTATION } from 'client/graph/mutations';
import { DEET_PERMISSIONS_QUERY } from 'client/graph/queries';

interface Props {
  deet: Deet;
  children: React.ReactElement<any>;
}

interface Permission {
  userId: number;
  permitted: boolean;
}

const DeetSharingModal = ({ deet, children }: Props) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [changedPerms, setChangedPerms] = React.useState<Array<Permission>>([]);
  const updateSharingPermissions = useMutation(
    UPDATE_SHARED_PERMISSIONS_MUTATION,
  );
  const { data, fetchMore, loading } = useQuery(DEET_PERMISSIONS_QUERY, {
    variables: {
      searchQuery: search,
      count: 20,
      after: null,
      deetId: deet.id,
    },
  });

  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  const trigger = React.cloneElement(children, { onClick: showModal });

  const setPerm = ({ userId, permitted }: Permission) => {
    const newPerms = [...changedPerms];
    const changeIndex = newPerms.findIndex(p => p.userId === userId);
    if (changeIndex > -1) {
      newPerms.splice(changeIndex, 1);
    } else {
      newPerms.push({ userId, permitted });
    }
    setChangedPerms(newPerms);
    console.log(newPerms);
  };

  return (
    <Modal trigger={trigger} open={show} onClose={closeModal} size="tiny">
      <Header icon="users" content="Sharing Settings" />
      <Modal.Content>
        <h3>Sharing settings for {deet.label}</h3>
      </Modal.Content>
      <Modal.Content>
        {loading ? (
          <Loader />
        ) : (
          <div className="friend-share-wrapper">
            {data.friends.items.map((friend: User) => {
              let hasAccessToDeet = friend.hasAccessToDeet;
              const change = changedPerms.find(p => p.userId === friend.id);
              if (change) {
                hasAccessToDeet = change.permitted;
              }

              return (
                <FriendShareItem
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
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            color="green"
            disabled={saving}
            onClick={async () => {
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
                throw e;
              }
              setSaving(false);
              closeModal();
            }}
          >
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
      `}</style>
    </Modal>
  );
};

function FriendShareItem({
  friend,
  setPerm,
}: {
  friend: User;
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

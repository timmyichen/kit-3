import * as React from 'react';
import { Card, Dropdown, Button, Icon } from 'semantic-ui-react';
import { User, PaginationResponse, Friend } from 'client/types';
import BlockUserModal from 'client/components/BlockUserModal';
import RemoveFriendModal from 'client/components/RemoveFriendModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';
import { FriendsDocument } from 'generated/generated-types';
import ProfileImage from 'client/components/ProfileImage';
import Link from 'next/link';

interface Props {
  friend: Friend;
}

export const PAGE_COUNT = 20;

const friendsQuery = {
  query: FriendsDocument,
  variables: { count: PAGE_COUNT, after: null },
};

const FriendItem = ({ friend }: Props) => {
  const dispatch = useCtxDispatch();

  const showBlockUserModal = () => {
    dispatch({
      type: 'SET_MODAL',
      modal: (
        <BlockUserModal
          user={friend}
          update={(cache, { data }) => {
            postMutationUpdateCache<
              { friends: PaginationResponse<Friend> },
              User
            >({
              cache,
              query: friendsQuery,
              fieldName: 'friends',
              isPaginated: true,
              type: 'remove',
              targetObj: data.blockUser,
            });
          }}
        />
      ),
    });
  };

  const showRemoveFriendModal = () => {
    dispatch({
      type: 'SET_MODAL',
      modal: (
        <RemoveFriendModal
          user={friend}
          update={(cache, { data }) => {
            postMutationUpdateCache<
              { friends: PaginationResponse<Friend> },
              Friend
            >({
              cache,
              query: friendsQuery,
              fieldName: 'friends',
              isPaginated: true,
              type: 'remove',
              targetObj: data.removeFriend,
            });
          }}
        />
      ),
    });
  };

  return (
    <div className="friend-list-item">
      <Card key={`friend-list-${friend.username}`}>
        <Card.Content>
          <ProfileImage
            profileImageUrl={friend.profilePicture}
            width={50}
            height={50}
            style={{ float: 'right' }}
          />
          <Card.Header>{friend.fullName}</Card.Header>
          <Card.Meta>{friend.username}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className="ctas">
            <Link
              href={`/friend?username=${friend.username}`}
              as={`/friend/${friend.username}`}
            >
              <a>
                <Button icon labelPosition="right">
                  <Icon name="magnify" />
                  View
                </Button>
              </a>
            </Link>
            <Dropdown
              text="Actions"
              icon="unordered list"
              floating
              labeled
              button
              className="icon"
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  text="Remove Friend"
                  icon="user x"
                  onClick={() => showRemoveFriendModal()}
                />
                <Dropdown.Item
                  text="Block"
                  icon="ban"
                  onClick={() => showBlockUserModal()}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Content>
      </Card>
      <style jsx>{`
        .ctas {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};

export default FriendItem;

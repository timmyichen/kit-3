import * as React from 'react';
import { Card, Image, Dropdown } from 'semantic-ui-react';
import { User, PaginationResponse } from 'client/types';
import BlockUserModal from 'client/components/BlockUserModal';
import RemoveFriendModal from 'client/components/RemoveFriendModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import { FRIENDS_QUERY } from 'client/graph/queries';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';

interface Props {
  friend: User;
}

export const PAGE_COUNT = 20;

const friendsQuery = {
  query: FRIENDS_QUERY,
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
              { friends: PaginationResponse<User> },
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
              { friends: PaginationResponse<User> },
              User
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
          <Image floated="right" size="mini" />
          <Card.Header>{friend.fullName}</Card.Header>
          <Card.Meta>{friend.username}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className="ctas">
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
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};

export default FriendItem;

import * as React from 'react';
import FriendSearch from 'client/friends/FriendSearch';
import { Menu } from 'semantic-ui-react';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>('my-friends');

  const menuItems = [
    { name: 'my-friends' },
    { name: 'find-friends' },
    { name: 'invite-friends' },
  ];

  return (
    <div className="friends-page">
      <Menu pointing secondary>
        {menuItems.map(item => (
          <Menu.Item
            key={`friends-nav-${item.name}`}
            name={item.name}
            active={activeTab === item.name}
            onClick={(_, { name }: { name: string }) => setActiveTab(name)}
          />
        ))}
      </Menu>

      {activeTab === 'find-friends' && <FriendSearch />}
      <style jsx>{`
        .friends-page {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsPage;

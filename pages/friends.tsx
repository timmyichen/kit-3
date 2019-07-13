import * as React from 'react';
import FriendSearch from 'client/friends/FriendSearch';
import FriendsDashboard from 'client/friends/FriendsDashboard';
import { Menu } from 'semantic-ui-react';
import { useRouter } from 'next/router';

type MenuKey = 'default' | 'find' | 'invite';

const menuItems = {
  default: { name: 'my-friends', slug: '' },
  find: { name: 'find-friends', slug: 'find' },
  invite: { name: 'invite-friends', slug: 'invite' },
};

const FriendsPage = () => {
  const router = useRouter();
  const slug = router && router.query && router.query.slug;
  const subPage = menuItems[(slug as MenuKey) || 'default'];
  const [activeTab, setActiveTab] = React.useState<string>(subPage.name);

  React.useEffect(() => {
    router.beforePopState(({ url }) => {
      const slug: MenuKey | undefined = url.split('?slug=')[1];

      if (slug) {
        setActiveTab(menuItems[slug].name);
      } else {
        setActiveTab('my-friends');
      }
      return true;
    });
  }, []);

  let content;
  switch (activeTab) {
    case 'find-friends':
      content = <FriendSearch />;
      break;
    case 'my-friends':
      content = <FriendsDashboard />;
      break;
  }

  return (
    <div className="friends-page">
      <Menu pointing secondary>
        {Object.keys(menuItems).map((key: MenuKey) => {
          const item = menuItems[key];
          return (
            <Menu.Item
              key={`friends-nav-${item.name}`}
              name={item.name}
              active={activeTab === item.name}
              onClick={(_, { name }: { name: string }) => {
                setActiveTab(name);

                let asPathname = '/friends';
                if (item.slug) {
                  asPathname += '/' + item.slug;
                }

                router.push(
                  {
                    pathname: '/friends',
                    query: { slug: item.slug },
                  },
                  asPathname,
                );
              }}
            />
          );
        })}
      </Menu>
      {content}
      <style jsx>{`
        .friends-page {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsPage;

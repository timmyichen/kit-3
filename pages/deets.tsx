import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import DeetDashboard from 'client/deets/DeetDashboard';
import { useRouter } from 'next/router';
import SharedDeetsDashboard from 'client/deets/SharedDeetsDashboard';

type MenuKey = 'default' | 'shared';

const menuItems = {
  default: { name: 'my-deets', slug: '' },
  shared: { name: 'shared-with-me', slug: 'shared' },
};

const Deets = () => {
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
        setActiveTab('my-deets');
      }
      return true;
    });
  }, []);

  let content;
  switch (activeTab) {
    case 'my-deets':
      content = <DeetDashboard />;
      break;
    case 'shared-with-me':
      content = <SharedDeetsDashboard />;
      break;
  }

  return (
    <div className="deets-page">
      <div className="deet-menu-wrapper">
        <Menu pointing secondary>
          {Object.keys(menuItems).map((key: MenuKey) => {
            const item = menuItems[key];
            return (
              <Menu.Item
                key={`deets-menu-${item.name}`}
                name={item.name}
                active={activeTab === item.name}
                onClick={(_, { name }: { name: string }) => {
                  setActiveTab(name);

                  let asPathname = '/deets';
                  if (item.slug) {
                    asPathname += '/' + item.slug;
                  }

                  router.push(
                    {
                      pathname: '/deets',
                      query: { slug: item.slug },
                    },
                    asPathname,
                  );
                }}
              />
            );
          })}
        </Menu>
      </div>
      {content}
      <style jsx>{`
        .deets-page {
          padding-top: 30px;
        }
        .deets-page .deet-menu-wrapper {
          position: relative;
        }
        .creator-wrapper {
          position: absolute;
          right: 0;
          top: 0;
        }
        @media only screen and (max-width: 400px) {
          .creator-wrapper {
            position: relative;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Deets;

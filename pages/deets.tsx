import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import DeetDashboard from 'client/deets/DeetDashboard';
import DeetCreator from 'client/deets/DeetCreator';

const Deets = () => {
  const [activeTab, setActiveTab] = React.useState<string>('my-deets');

  const menuItems = [{ name: 'shared-with-me' }, { name: 'my-deets' }];

  let content;
  switch (activeTab) {
    case 'my-deets':
      content = <DeetDashboard />;
      break;
  }

  return (
    <div className="deets-page">
      <div className="deet-menu-wrapper">
        <Menu pointing secondary>
          {menuItems.map(item => (
            <Menu.Item
              key={`deets-menu-${item.name}`}
              name={item.name}
              active={activeTab === item.name}
              onClick={(_, { name }: { name: string }) => setActiveTab(name)}
            />
          ))}
        </Menu>
        <div className="creator-wrapper">
          <DeetCreator />
        </div>
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

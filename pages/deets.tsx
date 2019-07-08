import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import DeetDashboard from 'client/deets/DeetDashboard';

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
      {content}
      <style jsx>{`
        .deets-page {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default Deets;

import * as React from 'react';
import PendingFriends from './PendingFriends';
import FriendsList from './FriendsList';
import useWindowSize from 'client/hooks/useWindowSize';
import { isBrowser } from 'client/lib/dom';

const FriendsDashboard = () => {
  const [colCount, setColCount] = React.useState<number>(3);

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  return (
    <div className="friends-page">
      <PendingFriends colCount={colCount} />
      <FriendsList colCount={colCount} />
      <style jsx>{`
        .friends-page {
        }
      `}</style>
    </div>
  );
};

export default FriendsDashboard;

import * as React from 'react';
import { Loader } from 'semantic-ui-react';

export default () => (
  <div className="loader-wrapper">
    <Loader active />
    <style jsx>{`
      .loader-wrapper {
        width: 100%;
        height: 50px;
        position: relative;
      }
    `}</style>
  </div>
);

import * as React from 'react';
import { Loader } from 'semantic-ui-react';

export default () => (
  <div className="loader-wrapper">
    <Loader className="loader-el" active />
    <style jsx>{`
      .loader-wrapper {
        width: 100%;
        height: 50px;
        position: relative;
      }
      .loader-wrapper :global(.loader-el)::after {
        border-color: #767676 transparent transparent !important;
      }
      .loader-wrapper :global(.loader-el)::before {
        border-color: rgba(0, 0, 0, 0.1) !important;
      }
    `}</style>
  </div>
);

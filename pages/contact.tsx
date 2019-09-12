import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import colors from 'client/styles/colors';
import { headerHeight } from 'client/lib/pageMeasurements';
import Meta from 'client/components/Meta';

export default () => (
  <div className="contact-wrapper">
    <Meta title="Contact Us" />
    <div className="overlay" />
    <h1>Keep in Touch with us!</h1>
    <h3>
      <span>
        <Icon name="mail outline" />
      </span>
      <a href="mailto:please@kit-with.me">please@kit-with.me</a>
    </h3>
    <style jsx>{`
      .contact-wrapper {
        position: relative;
        display: flex;
        background: url('/images/marketing/mailboxes.jpg') no-repeat center
          center fixed;
        background-size: cover;
        min-height: calc(100vh - ${headerHeight}px);
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
        color: #fff;
      }
      h1 {
        font-size: 72px;
        z-index: 1;
      }
      h3 {
        font-size: 40px;
        z-index: 1;
        display: flex;
        align-items: center;
      }
      h3 > span {
        background-color: ${colors.yellow};
        padding: 8px;
        color: #000;
        border-radius: 40px;
        margin-right: 15px;
      }
      h3 > span > :global(i) {
        margin: 0;
      }
      .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: hsla(0, 0%, 0%, 0.75);
      }
      a {
        color: #fff;
      }
      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </div>
);

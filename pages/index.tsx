import * as React from 'react';
import { Button } from 'semantic-ui-react';
import Link from 'next/link';

export default () => (
  <div className="index">
    <div className="heading">
      <div className="overlay" />
      <div className="title">
        <h1>Keep In Touch</h1>
      </div>
      <div className="subtitles">
        <h3>
          There are few feelings better than receiving letters from close
          friends.
        </h3>
        <h3>Let us help you keep in touch.</h3>
      </div>
      <div className="cta">
        <Link href="/signup">
          <a>
            <Button primary size="massive">
              Sign Up
            </Button>
          </a>
        </Link>
      </div>
    </div>
    <style jsx>{`
      .index :global(.ui.segment) {
        margin: none;
        padding: none;
        border: none;
      }
      .index .heading {
        position: relative;
        display: flex;
        background: url('/images/marketing/letters.jpg') no-repeat center center
          fixed;
        background-size: cover;
        min-height: calc(100vh - 60px);
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .index .heading .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: hsla(0, 0%, 0%, 0.75);
      }
      .index .heading .title {
        z-index: 1;
        color: #fff;
      }
      .index .heading h1 {
        font-size: 72px;
        text-align: center;
      }
      .subtitles {
        text-align: center;
        color: #fff;
        z-index: 1;
        margin-top: 100px;
      }
      .subtitles h3 {
        font-size: 26px;
      }
      .cta {
        margin-top: 50px;
        z-index: 1;
      }
    `}</style>
  </div>
);

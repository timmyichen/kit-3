import * as React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <div className="main-footer">
      <div className="nav">
        <div className="link">
          <Link href="/about">
            <a>About</a>
          </Link>
        </div>
        <div className="link">
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </div>
        <div className="link">
          <Link href="/terms">
            <a>Terms</a>
          </Link>
        </div>
        <div className="link">
          <Link href="/privacy">
            <a>Privacy</a>
          </Link>
        </div>
      </div>
      <div>© 2019 Keep In Touch TODO</div>
      <style jsx>{`
        .main-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          width: 100vw;
        }
        .nav {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          width: 250px;
        }
      `}</style>
    </div>
  );
}

export default Footer;

import * as React from 'react';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';

export default () => (
  <div>
    <Link href="/">
      <Button>Home</Button>
    </Link>
    <Link href="/login">
      <Button>Log in</Button>
    </Link>
    <Link href="/signup">
      <Button>Sign up</Button>
    </Link>
    <style jsx>{`
      .test {
        color: red;
      }
    `}</style>
  </div>
);

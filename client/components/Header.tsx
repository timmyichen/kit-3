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
    <Button>Sign up</Button>
    <style jsx>{``}</style>
  </div>
);

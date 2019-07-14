import * as React from 'react';
import { useCtxState } from './ContextProvider';

export default function Page({
  children,
}: {
  children: Array<React.ReactChild>;
}) {
  const { modal, currentUser } = useCtxState();
  console.log(currentUser);

  return (
    <div>
      {modal}
      {children}
      <style jsx>{`
        div {
          position: relative;
        }
      `}</style>
    </div>
  );
}

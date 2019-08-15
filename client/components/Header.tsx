import * as React from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import Link from 'next/link';
import colors from 'client/styles/colors';

interface Props {
  isAuthed: boolean;
}

function Header(props: Props) {
  const { pathname } = useRouter();

  let navLinks: Array<React.ReactNode>;
  let authLinks: Array<React.ReactNode>;

  if (props.isAuthed) {
    navLinks = [
      <HeaderNavLink
        key="header-nav-dashboard"
        currentPath={pathname}
        href="/dashboard"
        label="Dashboard"
      />,
      <HeaderNavLink
        key="header-nav-friends"
        currentPath={pathname}
        href="/friends"
        label="Friends"
      />,
      <HeaderNavLink
        key="header-nav-deets"
        currentPath={pathname}
        href="/deets"
        label="Deets"
      />,
    ];
    authLinks = [
      <HeaderNavLink
        key="header-nav-account"
        currentPath={pathname}
        href="/account"
        label="Account"
      />,
      <HeaderNavLink
        key="header-nav-logout"
        currentPath={pathname}
        href="/logout"
        label="Log out"
        noCSR
      />,
    ];
  } else {
    navLinks = [
      <HeaderNavLink
        key="header-nav-home"
        currentPath={pathname}
        href="/"
        label="Home"
      />,
      <HeaderNavLink
        key="header-nav-about"
        currentPath={pathname}
        href="/about"
        label="About"
      />,
      <HeaderNavLink
        key="header-nav-contact"
        currentPath={pathname}
        href="/contact"
        label="Contact"
      />,
    ];
    authLinks = [
      <HeaderNavLink
        key="header-nav-login"
        currentPath={pathname}
        href="/login"
        label="Log in"
      />,
      <HeaderNavLink
        key="header-nav-signup"
        currentPath={pathname}
        href="/signup"
        label="Sign up"
      />,
    ];
  }

  return (
    <div className="header">
      <div className="nav">{navLinks}</div>
      <div className="auth">{authLinks}</div>
      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          background-color: ${colors.blue};
        }
        .nav,
        .auth {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default Header;

interface NavProps {
  label: string;
  href: string;
  currentPath: string;
  noCSR?: boolean;
}

function HeaderNavLink({ label, href, currentPath, noCSR }: NavProps) {
  const link = (
    <div className={classnames('nav-link', { active: currentPath === href })}>
      {noCSR ? <a href={href}>{label}</a> : <a>{label}</a>}
      <style jsx>{`
        .nav-link {
          height: 100%;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .nav-link a {
          color: white;
        }
        .active,
        .nav-link:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );

  if (noCSR) {
    console.log('no thx csr');
    return link;
  }

  return <Link href={href}>{link}</Link>;
}

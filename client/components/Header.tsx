import * as React from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import Link from 'next/link';
import colors from 'client/styles/colors';

interface Props {
  isAuthed: boolean;
  router: Object;
}

function Header(props: Props) {
  const { pathname } = useRouter();
  console.log(pathname);

  let navLinks: Array<React.ReactNode>;
  let authLinks: Array<React.ReactNode>;

  if (props.isAuthed) {
    navLinks = [
      <HeaderNavLink
        currentPath={pathname}
        href="/dashboard"
        label="Dashboard"
      />,
      <HeaderNavLink currentPath={pathname} href="/friends" label="Friends" />,
      <HeaderNavLink
        currentPath={pathname}
        href="/contact-info"
        label="Contact Info"
      />,
    ];
    authLinks = [
      <HeaderNavLink currentPath={pathname} href="/account" label="Account" />,
    ];
  } else {
    navLinks = [
      <HeaderNavLink currentPath={pathname} href="/" label="Home" />,
      <HeaderNavLink currentPath={pathname} href="/about" label="About" />,
      <HeaderNavLink currentPath={pathname} href="/contact" label="Contact" />,
    ];
    authLinks = [
      <HeaderNavLink currentPath={pathname} href="/login" label="Log in" />,
      <HeaderNavLink currentPath={pathname} href="/signup" label="Sign up" />,
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
}

function HeaderNavLink({ label, href, currentPath }: NavProps) {
  return (
    <Link href={href}>
      <div className={classnames('nav-link', { active: currentPath === href })}>
        <a>{label}</a>
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
    </Link>
  );
}

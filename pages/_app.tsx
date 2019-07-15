import * as React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import Head from 'next/head';
import Header from 'client/components/Header';
import client from 'client/lib/apollo';
import { ContextProvider } from 'client/components/ContextProvider';
import Page from 'client/components/Page';
import UserLoader from 'client/components/UserLoader';
import fetch from 'isomorphic-fetch';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: any) {
    let user;
    if (ctx.req && ctx.req.user) {
      user = ctx.req.user;
    } else {
      user = await fetch('/data/user_info');
    }
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps: { ...pageProps, user } };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
        </Head>
        <ContextProvider>
          <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
              <UserLoader user={pageProps.user} />
              <Page>
                <Header isAuthed={!!pageProps.user} />
                <Component {...pageProps} />
              </Page>
            </ApolloHooksProvider>
          </ApolloProvider>
        </ContextProvider>
      </Container>
    );
  }
}

export default MyApp;

import * as React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import Head from 'next/head';
import camelize from 'camelize';
import Header from 'client/components/Header';
import client from 'client/lib/apollo';
import { ContextProvider } from 'client/components/ContextProvider';
import Page from 'client/components/Page';
import UserLoader from 'client/components/UserLoader';
import fetch from 'isomorphic-fetch';
import Footer from 'client/components/Footer';
import MessageRoll from 'client/components/MessageRoll';
import { footerHeight, headerHeight } from 'client/lib/pageMeasurements';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: any) {
    let user;
    if (ctx.req && ctx.req.user) {
      user = camelize(ctx.req.user);
    } else if (ctx.req) {
      const baseUrl = `${ctx.req.protocol}://${ctx.req.get('Host')}`;
      const response = await fetch(baseUrl + '/data/user_info');
      user = await response.json();
    } else {
      const response = await fetch('/data/user_info');
      user = await response.json();
    }

    if (user.error) {
      user = null;
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
                <div className="root-wrapper">
                  <MessageRoll />
                  <Header isAuthed={!!pageProps.user} />
                  <div className="page-wrapper">
                    <Component {...pageProps} />
                  </div>
                  <Footer />
                </div>
                <style jsx>{`
                  .page-wrapper {
                    margin-bottom: ${footerHeight}px;
                    min-height: calc(100vh - ${footerHeight + headerHeight}px);
                    height: 100%;
                  }
                  .root-wrapper {
                    position: relative;
                    height: 100%;
                    min-height: 100vh;
                  }
                  :global(.main-footer) {
                    position: absolute;
                    bottom: 0;
                    height: ${footerHeight}px;
                    width: 100%;
                  }
                `}</style>
              </Page>
            </ApolloHooksProvider>
          </ApolloProvider>
        </ContextProvider>
      </Container>
    );
  }
}

export default MyApp;

import * as React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import Head from 'next/head';
import Header from 'client/components/Header';
import client from 'client/lib/apollo';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
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
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <>
              <Header />
              <Component {...pageProps} />
            </>
          </ApolloHooksProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default MyApp;

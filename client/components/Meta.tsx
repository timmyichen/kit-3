import * as React from 'react';
import Head from 'next/head';

interface Props {
  description?: string;
  title: string;
}

const defaultDescription =
  'Keep in touch with your friends with this simple' +
  ' social network. Update your friends with your up-to-date and current' +
  ' address, phone number, or email with a simple click.';

function Meta({ title, description }: Props) {
  return (
    <Head>
      <meta name="description" content={description || defaultDescription} />
      <meta name="og:description" content={description || defaultDescription} />
      <title>{`KIT - ${title}`}</title>
    </Head>
  );
}

export default Meta;

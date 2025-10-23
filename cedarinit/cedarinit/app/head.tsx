import Head from 'next/head';

const MyHead = () => {
  return (
    <Head>
      <title>Cedar Initiative</title>
      <meta name="description" content="Empowering youth through community engagement and action." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://cdn.cedar-initiative.org/tailwind.css" />
    </Head>
  );
};

export default MyHead;
import Head from "next/head";

type CustomHead = {
  title?: string | undefined | null;
};

const CustomHead = ({ title }: CustomHead) => {
  return (
    <Head>
      <title>{title}</title>
      {/* META TAGS GO HERE */}
    </Head>
  );
};

export default CustomHead;

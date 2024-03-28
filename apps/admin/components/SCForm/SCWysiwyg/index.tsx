import dynamic from 'next/dynamic';
const Wysiwyg = dynamic(() => import('./nossr'), { ssr: false });

function SCWysiwyg({ props }: any) {
  return <Wysiwyg {...props} />;
}

export default SCWysiwyg;

import Router from 'next/navigation';

function PublicPages({ title, children }: any) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 grid place-content-center">
      <div className="flex justify-center mb-5 cursor-pointer"></div>
      <h1 className="text-3xl mb-4 text-center">{title}</h1>
      <div className="bg-white p-10 rounded sm:w-full lg:w-[450px] shadow-lg">
        {children}
      </div>
    </section>
  );
}

export default PublicPages;

import Link from 'next/link';

export const Country = ({ country, countryImage, slug }: any) => {
  return (
    <Link href={`/university?country=${slug}`} className="w-full">
      <div className="bg-white f rounded-lg shadow-md  h-[350px] w-full relative overflow-hidden">
        <div
          style={{
            backgroundImage: `url(${countryImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h5 className="text-xl f font-semibold">Study in {country}</h5>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

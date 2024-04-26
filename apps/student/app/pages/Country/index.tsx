import Link from 'next/link';

export const Country = ({ country, countryImage, slug }: any) => {
  return (
    <Link href={`/university?country=${slug}`}>
      <div className="bg-white font-['Open_Sans'] rounded-lg shadow-md mx-2 xl:mx-10 h-[300px] w-[400px] relative overflow-hidden">
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
              <h5 className="text-lg font-['Open_Sans']">Study in {country}</h5>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

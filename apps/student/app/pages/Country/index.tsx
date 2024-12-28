import Link from 'next/link';
import Image from 'next/image'; // For optimized image handling
import Logo from '../../../assets/Logo/Logo.png'; // Ensure the path is correct

export const Country = ({ country, countryImage, slug }: any) => {
  return (
    <Link href={`/university/country/${slug}`} className="w-full">
      <div className=" border  border-shadow bg-white rounded-full shadow-md h-[100px] w-[100px] overflow-hidden">
        <div
          style={{
            backgroundImage: `url(${countryImage?.src || Logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Semi-transparent overlay */}
        </div>
      </div>
      <span className="text-sm font-medium text-black">{country}</span>
    </Link>
  );
};

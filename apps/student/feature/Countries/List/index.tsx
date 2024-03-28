import Image from 'next/image';
import React from 'react';

interface CountryProps {
  country: string;
  countryImage: any;
}

const Country: React.FC<CountryProps> = ({ country, countryImage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md mx-2 xl:mx-10 h-[300px] w-[400px] relative overflow-hidden ">
      <div
        style={{
          backgroundImage: `url(${countryImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="absolute inset-0 flex">
          <div className="text-white text-center pt-[250px] mx-4">
            <h5 className="text-black text-bold">Study in {country}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Country;

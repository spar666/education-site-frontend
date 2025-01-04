'use client';

import Image from 'next/image';
import { renderImage } from 'libs/services/helper';
import student from '../../../assets/images/student2.png';

interface HeroImageProps {
  imagePath: any;
}

export const HeroImage = ({ imagePath }: HeroImageProps) => (
  <div className="relative hidden lg:block">
    <div className="relative rounded-2xl overflow-hidden  h-[300px]">
      <Image
        src={renderImage({
          imgPath: imagePath || student,
          size: 'md',
        })}
        alt="Student"
        width={300}
        height={400}
        className="relative z-10 object-contain w-full h-full transform transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary-yellow/20 rounded-full blur-2xl"></div>
      <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
    </div>
  </div>
);

import React from 'react';
// import { MOCK_GALLERY_IMAGES } from '../constants';
import { ImageIcon } from 'lucide-react';

const MOCK_GALLERY_IMAGES = [
  "https://picsum.photos/id/1029/400/300",
  "https://picsum.photos/id/1033/400/500",
  "https://picsum.photos/id/1015/400/300",
  "https://picsum.photos/id/1039/400/300",
  "https://picsum.photos/id/1018/400/400",
  "https://picsum.photos/id/1047/400/300",
];

const Gallery: React.FC = () => {
  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-6">
         <ImageIcon className="w-5 h-5 text-brand-500" />
         <h2 className="text-2xl font-bold text-slate-900">Campus Gallery</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MOCK_GALLERY_IMAGES?.map((src, index) => (
          <div key={index} className={`relative overflow-hidden rounded-xl group ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'} h-full min-h-[150px]`}>
            <img 
              src={src} 
              alt={`Campus view ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
               <p className="text-white text-sm font-medium">Campus Life</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
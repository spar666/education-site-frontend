import { Calendar, Clock, Tag } from 'lucide-react';

export const Subject = ({ name, duration, startDate, fees, level }: any) => {
  return (
    <div className="w-[300px] h-[300px] gap-5 xl:mx-10 rounded-lg overflow-hidden bg-white shadow-md border border-gray-200">
      <div className="p-4 gap-5">
        <h5 className="font-bold text-black text-lg mb-2">{name}</h5>
        <p className="text-sm mb-2 font-bold ">Level: {level}</p>
        <div className="flex items-center text-sm mb-2 font-bold ">
          <Clock className="mr-2" size={18} />
          <span> Full time-{duration}</span>
        </div>
        <div className="flex items-center text-sm mb-2 font-bold ">
          <Calendar className="mr-2" size={18} />
          <span> Start Date-{startDate}</span>
        </div>
        <div className="flex items-center text-sm font-bold ">
          <Tag className="mr-2" size={18} />
          <span>A{fees} per year</span>
        </div>
      </div>
    </div>
  );
};

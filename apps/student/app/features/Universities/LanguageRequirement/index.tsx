export const UniversityLanguageRequirement = ({
  country,
  countryImage,
}: any) => {
  return (
    <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 h-screen w-full bg-gray-50">
      <h3 className="text-2xl font-bold text-center">Requirements</h3>

      <div className="flex gap-6 mx-auto">
        <div className="border-2 border-black w-52 flex flex-col items-center">
          <span className="font-bold">IELTS Score</span>
          <div className="flex flex-wrap justify-center">
            <div className="flex items-center">
              <span className="text-sm font-bold">Undergraduates:</span>
              <span className="text-sm ml-1">6.0</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold">Postgraduates:</span>
              <span className="text-sm ml-1">6.5</span>
            </div>
          </div>
        </div>
        <div className="border-2 border-black w-52 flex flex-col items-center">
          <span className="font-bold">TOFEL Score</span>
          <div className="flex flex-wrap justify-center">
            <div className="flex items-center">
              <span className="text-sm font-bold">Undergraduates:</span>
              <span className="text-sm ml-1">80</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold">Postgraduates:</span>
              <span className="text-sm ml-1">100</span>
            </div>
          </div>
        </div>
        <div className="border-2 border-black w-52 flex flex-col items-center">
          <span className="font-bold">PTE Score</span>
          <div className="flex flex-wrap justify-center">
            <div className="flex items-center">
              <span className="text-sm font-bold">Undergraduates:</span>
              <span className="text-sm ml-1">55</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold">Postgraduates:</span>
              <span className="text-sm ml-1">65</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

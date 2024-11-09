export const UniversityCourses = ({ country, countryImage }: any) => {
  return (
    <div className="f bg-white rounded-lg shadow-md mx-2 xl:mx-10 h-[200px] w-[200px] relative overflow-hidden ">
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
          <div className="text-white text-center pt-[150px] mx-4">
            <h5 className="text-white font-bold ">Study in {country}</h5>
            <span className="text-sm m-0 ">10 Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

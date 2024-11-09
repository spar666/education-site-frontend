import { Card, Typography } from 'antd';

const UniversityRankingCard = ({ worldRanking, countryRanking }: any) => {
  return (
    <section className="py-4 flex flex-col gap-2">
      {/* <div className="flex flex-wrap gap-4">
        <Card className="bg-white w-[200px] rounded" title="World Ranking">
          <h1 className="font-bold text-navy-blue text-1xl">{worldRanking}</h1>
        </Card>

        <Card className="bg-white w-[200px] rounded" title="Country Ranking">
          <h1 className="font-bold text-navy-blue text-1xl">
            {countryRanking}
          </h1>
        </Card>
      </div> */}
      <div className="pl-10 pr-3 py-3 bg-[#EBF5FF] flex items-center justify-between">
        <h1 className="text-base">World Ranking</h1>
        <h2 className="bg-secondary-yellow  py-2 font-bold text-xl w-16 text-center">
          {worldRanking}
        </h2>
      </div>
      {/* <div className="pl-10 pr-3 py-3 bg-[#EBF5FF] flex items-center justify-between">
        <h1 className="text-base">Country Ranking</h1>
        <h2 className="bg-secondary-yellow  py-2 font-bold text-xl w-16 text-center">
          {countryRanking}
        </h2>
      </div> */}
    </section>
  );
};

export default UniversityRankingCard;

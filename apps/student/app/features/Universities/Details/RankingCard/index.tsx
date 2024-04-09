import { Card, Typography } from 'antd';

const UniversityRankingCard = ({ worldRanking, countryRanking }: any) => {
  return (
    <section className="py-4">
      <div className="flex flex-wrap gap-4">
        <Card className="bg-white w-[200px] rounded" title="World Ranking">
          <h1 className="font-bold text-navy-blue text-1xl">{worldRanking}</h1>
        </Card>

        <Card className="bg-white w-[200px] rounded" title="Country Ranking">
          <h1 className="font-bold text-navy-blue text-1xl">
            {countryRanking}
          </h1>
        </Card>
      </div>
    </section>
  );
};

export default UniversityRankingCard;

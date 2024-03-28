import { Card, Typography } from 'antd';

const UniversityRankingCard = ({ worldRanking, countryRanking }: any) => {
  return (
    <section className="py-4">
      <div className="flex flex-wrap gap-4">
        <Card className="bg-white w-[200px]" title="World Ranking">
          <Typography.Paragraph>{worldRanking}</Typography.Paragraph>
        </Card>

        <Card className="bg-white" title="Country Ranking">
          <Typography.Paragraph>{countryRanking}</Typography.Paragraph>
        </Card>
      </div>
    </section>
  );
};

export default UniversityRankingCard;

// import { useQuery } from "@apollo/client";
// import { Row } from "antd";
// import { ActiveTrekSpecialist, TrekSpecilistList } from "apps/sc-admin/assets/icons";
// import JTAdminCard from "apps/sc-admin/components/SCAdminCard";
// import { USER_STATS } from "apps/sc-admin/api/StatsCard";

// function UserDetailSection() {
//   const { data, loading } = useQuery(USER_STATS);
//   return (
//     <div className="bg-[#f0f2f5] pb-5 mt-10">
//       <Row gutter={[16, 16]}>
//         <JTAdminCard
//           loader={loading}
//           title={"Total No. of User"}
//           icon={TrekSpecilistList}
//           count={data?.getUserStats?.totalUser}
//         />
//         <JTAdminCard
//           loader={loading}
//           title={"Active User"}
//           icon={ActiveTrekSpecialist}
//           count={data?.getUserStats?.totalActiveUser}
//         />
//       </Row>
//     </div>
//   );
// }

// export default UserDetailSection;

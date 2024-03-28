// import {
//   CheckCircleTwoTone,
//   CloseCircleTwoTone,
//   DownloadOutlined,
//   EyeFilled,
//   SearchOutlined,
// } from "@ant-design/icons";
// import { Button, DatePicker, Popconfirm, Space, Switch, Table } from "antd";
// import { ColumnsType } from "antd/lib/table";
// import DebounceInput from "apps/sc-admin/components/DebounceInput";
// import AdminLayout from "apps/sc-admin/components/SCLayout_v2";
// import { PERMISSION } from "apps/sc-admin/constants/permission";
// import usePermissions from "apps/sc-admin/hooks/usePermissions";
// import Link from "next/link";
// import useGetUserList from "../hooks/useGetUserList";
// import UserDetailSection from "./UserDetailsSection";
// const { RangePicker } = DatePicker;

// const VerificationColumn = ({ record }) => {
//   return (
//     <Space>
//       {record.verified ? (
//         <CheckCircleTwoTone twoToneColor="#52c41a" className="text-2xl" />
//       ) : (
//         <CloseCircleTwoTone twoToneColor="#eb2f96" className="text-2xl" />
//       )}
//     </Space>
//   );
// };
// function ListUser() {
//   const {
//     data,
//     loading,
//     search,
//     dateFilter,
//     changePage,
//     searchUser,
//     pagination,
//     toggleLoading,
//     toggleTravellerStatusHandler,
//   } = useGetUserList();

//   const checkPermissions = usePermissions([
//     PERMISSION.TOGGLE_USER_STATUS,
//     PERMISSION.GET_USER_BY_ID,
//   ]);
//   function hasPermissions(name: string) {
//     return checkPermissions[name];
//   }
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phoneNumber1",
//       key: "phoneNumber1",
//       render: (text, record) => {
//         return <>{String(record?.phoneNumber1 ? record?.phoneNumber1 : "N/A")}</>;
//       },
//     },
//     {
//       title: "Verified",
//       dataIndex: "verified",
//       key: "verified",
//       align: "center",
//       render: (text, record) => <VerificationColumn record={record} />,
//     },
//     {
//       title: "Active",
//       dataIndex: "id",
//       key: "id",
//       permission: PERMISSION.TOGGLE_USER_STATUS,
//       render: (id, r) => (
//         <Popconfirm title="Are you sure?" onConfirm={() => toggleTravellerStatusHandler(id)}>
//           <Switch
//             checked={r.isActive}
//             style={{ backgroundColor: r.isActive ? "#53C31B" : null }}
//             id="publishSwitch"
//             className="text-2xl"
//           />
//         </Popconfirm>
//       ),
//     },
//     {
//       title: "View",
//       dataIndex: "id",
//       key: "id",
//       permission: PERMISSION.GET_USER_BY_ID,
//       render: (id) => (
//         <Space size="middle">
//           <Link href={`/users/${id}`} passHref>
//             <EyeFilled className="text-2xl" />
//           </Link>
//         </Space>
//       ),
//     },
//   ];

//   const tableTitle = () => {
//     return (
//       <>
//         <div className="flex justify-between items-center">
//           <h3 className="text-xl font-bold">Travelers</h3>
//           <a href={process.env.NEXT_PUBLIC_ADMIN_DOWNLOAD_URL + "/traveller/download"} download>
//             <Button
//               className="flex items-center rounded-xl justify-center py-5"
//               size="middle"
//               style={{ border: "1px solid black" }}
//             >
//               <DownloadOutlined className="!mt-0.75 !font-semibold" />
//               <span className="font-semibold">Download File</span>
//             </Button>
//           </a>
//         </div>
//         <div className="flex gap-5 items-center mt-10">
//           <div className="w-[290px]">
//             <DebounceInput
//               text={search + ""}
//               placeholder="Search User by name"
//               prefix={<SearchOutlined className="mx-2" />}
//               callback={searchUser}
//             />
//           </div>
//           <RangePicker
//             allowClear={true}
//             className="w-[290px] pt-2"
//             style={{ height: "52px", border: "1px solid #99acbd", borderRadius: "2px" }}
//             format={"MMM DD, YYYY"}
//             onChange={dateFilter}
//             placeholder={["From", "To"]}
//           />
//         </div>
//       </>
//     );
//   };

//   return (
//     <AdminLayout title="Travelers" showTitle>
//       <UserDetailSection />
//       <Table
//         title={tableTitle}
//         loading={loading || toggleLoading}
//         columns={columns as ColumnsType}
//         dataSource={data}
//         onChange={changePage}
//         pagination={pagination}
//       />
//     </AdminLayout>
//   );
// }

// export default ListUser;

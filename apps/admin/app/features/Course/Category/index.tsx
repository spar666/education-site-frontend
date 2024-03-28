// import { EditTwoTone, QuestionCircleOutlined } from "@ant-design/icons";
// import { useMutation, useQuery } from "@apollo/client";
// import { Button, Popconfirm, Space, Switch, Table, notification } from "antd";
// import { ColumnType } from "antd/lib/table";
// import AdminLayout from "apps/sc-admin/components/SCLayout_v2";
// import { GET_ALL_BLOGS_CATEGORY, UPDATE_BLOG_CATEGORY_STATUS } from "apps/sc-admin/api/Blogs";
// import usePermissions from "apps/sc-admin/hooks/usePermissions";
// import Link from "next/link";
// import { useRouter } from "next/router";
// const ActiveColumn = ({
//   id,
//   isActive,
//   onActiveToggle,
//   disable,
// }: {
//   id: string;
//   isActive: boolean;
//   disable?: boolean;
//   onActiveToggle: (id) => void;
// }) => {
//   return (
//     <Popconfirm
//       id="popConfirm"
//       disabled={disable}
//       title={`Are you sure you want to ${isActive ? "Unpublish" : "Publish"} this blog category?`}
//       icon={<QuestionCircleOutlined style={{ color: "red" }} />}
//       onConfirm={() => onActiveToggle(id)}
//       okText="Yes"
//     >
//       <Space size="middle">
//         <Switch
//           checked={isActive}
//           disabled={disable}
//           style={{ backgroundColor: isActive && "#53C31B" }}
//           id="ratingSwitch"
//         />
//       </Space>
//     </Popconfirm>
//   );
// };
// function BlogCategoryList() {
//   const router = useRouter();
//   const { page = 1 } = router.query;
//   const { data, loading, refetch } = useQuery(GET_ALL_BLOGS_CATEGORY, {
//     variables: { data: { page: Number(page), limit: 10 } },
//   });
//   const [updatedCategoryStatus] = useMutation(UPDATE_BLOG_CATEGORY_STATUS);

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "category",
//       key: "category",
//     },
//     {
//       title: "Published",
//       dataIndex: "isActive",
//       key: "isActive",
//       align: "center",
//       sorter: (a, b) => b.isActive - a.isActive,
//       render: (text, record) => {
//         return (
//           <ActiveColumn
//             id={record?.key}
//             isActive={record?.isActive}
//             // disable={!record.verified}
//             onActiveToggle={(id) =>
//               updatedCategoryStatus({ variables: { id } })
//                 .then((response) => {
//                   if (response.data.updateBlogCategoryStatus.status == 200) {
//                     notification.success({
//                       message: response.data.updateBlogCategoryStatus.message,
//                     });
//                     refetch();
//                   } else {
//                     notification.error({ message: response.data.updateBlogCategoryStatus.message });
//                   }
//                 })
//                 .catch((e) => {
//                   notification.error({ message: e.message });
//                 })
//             }
//           />
//         );
//       },
//     },
//     {
//       title: "Edit",
//       dataIndex: "action",
//       key: "action",
//       align: "center",
//       render: (text, record) => {
//         return (
//           <Space size="middle" className="test">
//             <Link href={`/blogs/category/edit/${record?.key}`} passHref>
//               <EditTwoTone className="text-2xl" />
//             </Link>
//           </Space>
//         );
//       },
//     },
//   ];

//   const dateSource = data?.getAllBlogCategories?.items
//     .map((item) => {
//       return {
//         key: item.id,
//         category: item.category,
//         isActive: item?.isActive,
//       };
//     })
//     .reverse();

//   return (
//     <AdminLayout title="Blog Category">
//       <Table
//         title={() => {
//           return (
//             <div className="flex items-start justify-between my-3">
//               <h3 className="text-xl font-bold">Blogs Category</h3>

//               <div className="flex justify-between  items-center">
//                 <Button
//                   type="primary"
//                   onClick={() => router.push("/blogs/category/create")}
//                   id="addGuide"
//                   size={"large"}
//                 >
//                   Add New Blog Category
//                 </Button>
//               </div>
//             </div>
//           );
//         }}
//         columns={
//           columns.filter((column: any) => {
//             if (!column.permission) return true;
//           }) as ColumnType<{
//             key: string;
//             name: string;
//             email: string;
//             phone: string;
//             calender: number;
//             verified: boolean;
//             isActive: boolean;
//             permission?: string | string[];
//           }>[]
//         }
//         dataSource={dateSource}
//         loading={loading}
//         pagination={{
//           current: Number(page),
//           hideOnSinglePage: true,
//           showSizeChanger: false,
//           total: data?.getAllBlogCategories?.meta?.total,
//         }}
//         onChange={(pagination) => {
//           router.push(`/blogs/category?page=${pagination.current}`, undefined, { shallow: true });
//         }}
//       />
//     </AdminLayout>
//   );
// }

// export default BlogCategoryList;

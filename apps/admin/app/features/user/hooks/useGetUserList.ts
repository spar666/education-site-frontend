// import { useMutation, useQuery } from "@apollo/client";
// import { notification } from "antd";
// import { GET_USER_LIST, TOGGLE_USER_STATUS } from "apps/sc-admin/api/Users";
// import { startCase } from "lodash";
// import { Moment } from "moment";
// import { useRouter } from "next/router";
// import { useEffect } from "react";

// function useGetUserList() {
//   const router = useRouter();
//   const { search = "", page = 1, fromDate = "", toDate = "" } = router.query;

//   const {
//     data,
//     loading,
//     refetch: refetchList,
//   } = useQuery(GET_USER_LIST, {
//     variables: {
//       options: {
//         filter: {
//           search,
//           filterByDate: {
//             fromDate: fromDate || null,
//             toDate: toDate || null,
//           },
//         },
//         pagination: {
//           page: Number(page),
//           limit: 10,
//         },
//       },
//     },
//   });

//   const [toggleTravellerStatus, { loading: toggleLoading, error: toggleError }] =
//     useMutation(TOGGLE_USER_STATUS);

//   function toggleTravellerStatusHandler(id: String) {
//     toggleTravellerStatus({ variables: { id } })
//       .then((res: any) => {
//         notification.success({ message: res.data.toggleTravellerStatus.message });
//         refetchList();
//       })
//       .catch(console.log);
//   }

//   function searchUser(search: string) {
//     router.push(`/users?search=${search}`);
//   }

//   function dateFilter(dates: Array<Moment> | null) {
//     let newQuery;
//     if (dates) {
//       newQuery = {
//         ...router.query,
//         fromDate: dates[0].format("YYYY-MM-DD"),
//         toDate: dates[1].format("YYYY-MM-DD"),
//       };
//     } else {
//       newQuery = { ...router.query };
//       delete newQuery.fromDate;
//       delete newQuery.toDate;
//     }
//     router.push({ pathname: "/users", query: newQuery });
//   }

//   function changePage(page) {
//     router.push(`/users?search=${search}&page=${page.current}`);
//   }

//   function formattedData(data) {
//     return data?.map((admin) => ({
//       ...admin,
//       name: startCase(admin.firstName) + " " + startCase(admin.lastName),
//       verified: admin.isEmailVerified,
//     }));
//   }

//   // error handling
//   useEffect(() => {
//     const error = toggleError;
//     if (error) {
//       return notification.error({ message: error?.message });
//     }
//   }, [toggleError]);

//   return {
//     data: data ? formattedData(data.getTravellers.items) : [],
//     loading,
//     search,
//     dates: [fromDate, toDate],
//     dateFilter,
//     searchUser,
//     changePage,
//     pagination: {
//       current: Number(page),
//       hideOnSinglePage: false,
//       showSizeChanger: false,
//       total: data?.getTravellers?.meta?.totalCounts || 10,
//     },
//     toggleLoading,
//     toggleTravellerStatusHandler,
//   };
// }

// export default useGetUserList;

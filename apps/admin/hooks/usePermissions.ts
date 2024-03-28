// import React from "react";
// import { useSelector } from "react-redux";
// import { selectUserDetails } from "../store/userSlice";

// function usePermissions(permissions = []): Array<{}> {
//   const { user } = useSelector(selectUserDetails);
//   if (!user) return Array(permissions.length).fill(false);
//   const userPermissions: Array<string> = user?.roles?.permission?.map((perms) => perms.apiName);
//   const hasPermissions = permissions.reduce((acc, curr) => {
//     return { ...acc, [curr]: userPermissions?.includes(curr) };
//   }, {});
//   return hasPermissions;
// }

// export default usePermissions;

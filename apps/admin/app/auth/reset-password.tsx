// import { gql, useLazyQuery, useMutation } from "@apollo/client";
// import { Alert, Button, Spin, notification } from "antd";
// import JTInput from "apps/sc-admin/components/SCForm/SCInput";
// import PublicPages from "apps/sc-admin/components/PublicPages";
// import { isValidPassword } from "libs/services/helper";
// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";

// const VERIFY_TOKEN = gql`
//   query ($token: String!) {
//     verifyRequestPasswordToken(token: $token) {
//       status
//       message
//     }
//   }
// `;

// const RESET_PASSWORD = gql`
//   mutation ($data: ResetPasswordInput!) {
//     resetPassword(data: $data) {
//       status
//       message
//     }
//   }
// `;

// function verifyEmail() {
//   const router = useRouter();
//   const { token } = router.query;

//   const [verifyToken, { data: verifyData, loading }] = useLazyQuery(VERIFY_TOKEN, {
//     variables: { token },
//   });
//   const [resetPassword, { loading: submitLoading }] = useMutation(RESET_PASSWORD);

//   const {
//     watch,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   function resetPasswordHandler(data) {
//     resetPassword({
//       variables: { data: { password: data.password, token } },
//     }).then((res: any) => {
//       if (String(res?.data?.resetPassword?.status).startsWith("20")) {
//         notification.success({ message: res?.data?.resetPassword?.message });
//         router.push("/");
//       } else {
//         notification.error({ message: res?.data?.resetPassword?.message });
//       }
//     });
//   }

//   useEffect(() => {
//     token && verifyToken();
//   }, [token]);

//   return (
//     <PublicPages title="Reset Password">
//       <div className="h-fit">
//         {loading ? (
//           <>
//             <Alert
//               className="text-center bg-blue-100"
//               message={
//                 <>
//                   <Spin />
//                   <span className="ml-3">Verifying Link</span>
//                 </>
//               }
//               description="Please hold while we verify your link"
//               type="info"
//             />
//           </>
//         ) : verifyData?.verifyRequestPasswordToken?.status == 400 ? (
//           <Alert className=" text-center" message="Error verifying your token" type="error" />
//         ) : (
//           <form onSubmit={handleSubmit(resetPasswordHandler)} className="bg-white p-10 rounded">
//             <h2 className="text-xl font-bold mb-3">Enter New Password</h2>
//             <JTInput
//               type="password"
//               control={control as any}
//               name="password"
//               placeholder="New Password"
//               inputfieldClass="!h-[60px]"
//               size="small"
//               rules={{
//                 required: "New Password is required!",
//                 validate: (val) =>
//                   isValidPassword(val) ||
//                   "Password should be between 8-20 characters with atleast 1 symbol, 1 uppercase, 1 lowercase and 1 number",
//               }}
//               error={errors?.password?.message}
//             />
//             <div className="mt-4">
//               <JTInput
//                 type="password"
//                 control={control as any}
//                 name="confirmPassword"
//                 size="small"
//                 inputfieldClass="!h-[60px] "
//                 placeholder="Confirm Password"
//                 rules={{
//                   required: "Confirm Password is required!",
//                   validate: (val) =>
//                     ((isValidPassword(val) ||
//                       "Password should be between 8-20 characters with atleast 1 symbol, 1 uppercase, 1 lowercase and 1 number") &&
//                       val === watch("password")) ||
//                     "New Password and Confirm Password must match",
//                 }}
//                 error={errors?.confirmPassword?.message}
//               />
//             </div>
//             <Button
//               loading={submitLoading}
//               htmlType="submit"
//               size="large"
//               className="btn bg-blue-500 text-white mt-4 w-full"
//             >
//               Reset
//             </Button>
//           </form>
//         )}
//       </div>
//     </PublicPages>
//   );
// }

// export default verifyEmail;

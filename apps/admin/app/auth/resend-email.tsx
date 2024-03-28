// import { useLazyQuery } from "@apollo/client";
// import { Alert, Button, Input, Space, notification } from "antd";
// import PublicPages from "apps/sc-admin/components/PublicPages";
// import { RESEND_VERIFY_EMAIL } from "apps/sc-admin/api/Auth";
// import { isValidEmail } from "libs/services/helper";
// import { useEffect, useRef } from "react";
// import { Controller, useForm } from "react-hook-form";

// function ResendVerification() {
//   const ref = useRef<any>();
//   const [resendEmail, { loading }] = useLazyQuery(RESEND_VERIFY_EMAIL, {
//     fetchPolicy: "network-only",
//   });
//   const { handleSubmit, control, reset } = useForm({
//     defaultValues: {
//       email: "",
//     },
//   });

//   function resendVerficationHandler(data) {
//     resendEmail({ variables: { email: data.email, role: "admin" } })
//       .then((res: any) => {
//         if (res?.error?.message) throw notification.error({ message: res.error.message });
//         const {
//           data: { resendVerificationEmail },
//         } = res;
//         if (String(resendVerificationEmail.status).startsWith("40")) {
//           return notification.error({ message: resendVerificationEmail.message });
//         } else if (String(resendVerificationEmail.status).startsWith("30")) {
//           return notification.warning({ message: resendVerificationEmail.message });
//         } else {
//           notification.success({ message: resendVerificationEmail.message });
//           reset();
//         }
//       })
//       .catch((res) => {
//         notification.error({ message: res.message });
//       });
//   }

//   useEffect(() => {
//     ref?.current?.focus();
//   }, []);

//   return (
//     <PublicPages title={"Resend Verification Email"}>
//       <h4 className="text-xl mb-5">Enter email to resend verification link</h4>
//       <form onSubmit={handleSubmit(resendVerficationHandler)}>
//         <Space size="large" direction="vertical" className="w-full">
//           <Controller
//             name="email"
//             control={control}
//             rules={{
//               required: "Email is required!",
//               validate: (email) =>
//                 isValidEmail(email) || "The email you’ve entered is incorrect. Please, try again.",
//             }}
//             render={({ field: { onChange, value }, formState: { errors } }) => (
//               <>
//                 <Input
//                   ref={ref}
//                   autoComplete="new-password"
//                   placeholder="Email*"
//                   type="text"
//                   onChange={onChange}
//                   value={value}
//                 />
//                 {errors?.email && (
//                   <div className="mt-1 mb-4">
//                     <Alert
//                       message={<span className="text-red-400">{errors.email?.message}</span>}
//                       type="error"
//                     />
//                   </div>
//                 )}
//               </>
//             )}
//           />
//         </Space>
//         <Button
//           size="large"
//           className="w-full bg-blue-500 text-white mt-4"
//           htmlType="submit"
//           loading={loading}
//         >
//           Send Verification Link
//         </Button>
//       </form>
//     </PublicPages>
//   );
// }

// export default ResendVerification;

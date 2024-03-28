// import { Alert, Button, Input, notification, Space } from "antd";
// import PublicPages from "apps/sc-admin/components/PublicPages";
// import { RESET_PASSWORD_REQUEST } from "apps/sc-admin/api/Auth";
// import { isValidEmail } from "libs/services/helper";
// import { useEffect, useRef } from "react";
// import { Controller, useForm } from "react-hook-form";

// function ForgotPassword() {
//   const ref = useRef<any>();
//   const [sendEmail, { loading }] = useMutation(RESET_PASSWORD_REQUEST, {
//     onError: ({ message }) => notification.error({ message }),
//   });
//   const { handleSubmit, control, reset } = useForm({
//     defaultValues: {
//       email: "",
//     },
//   });

//   function forgotPasswordHandler(data) {
//     sendEmail({ variables: { data: { email: data.email, role: "ADMIN" } } })
//       .then((res: any) => {
//         const message = res?.data?.requestResetPassword?.message;
//         const errorStatus = res?.data?.requestResetPassword?.status.startsWith("40");
//         if (errorStatus) {
//           return notification.error({ message });
//         }
//         reset();
//         notification.success({ message: res.data.requestResetPassword.message });
//       })
//       .catch(console.log);
//   }

//   useEffect(() => {
//     ref?.current?.focus();
//   }, []);

//   return (
//     <PublicPages title="Forgot Password">
//       <h4 className="text-xl mb-5">Enter email for reset password link</h4>
//       <form onSubmit={handleSubmit(forgotPasswordHandler)}>
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
//           Send Link
//         </Button>
//       </form>
//     </PublicPages>
//     // <section className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 p-5 grid place-content-center">
//     //   <div className="flex justify-center mb-10 cursor-pointer" onClick={() => Router.push("/")}>
//     //     <JewelTrekLogoWithText dark />
//     //   </div>
//     //   <h1 className="text-3xl mb-5">Forgot Password</h1>
//     //   <div className="bg-white p-10 rounded sm:w-full lg:w-[450px]">
//     //     <h4 className="text-xl mb-5">Enter email for reset password link</h4>
//     //     <form onSubmit={handleSubmit(forgotPasswordHandler)}>
//     //       <Space size="large" direction="vertical" className="w-full">
//     //         <Controller
//     //           name="email"
//     //           control={control}
//     //           rules={{
//     //             required: "Email is required!",
//     //             validate: (email) =>
//     //               isValidEmail(email) ||
//     //               "The email you’ve entered is incorrect. Please, try again.",
//     //           }}
//     //           render={({ field: { onChange, value }, formState: { errors } }) => (
//     //             <>
//     //               <Input
//     //                 ref={ref}
//     //                 autoComplete="new-password"
//     //                 placeholder="Email*"
//     //                 type="text"
//     //                 onChange={onChange}
//     //                 value={value}
//     //               />
//     //               {errors?.email && (
//     //                 <div className="mt-1 mb-4">
//     //                   <Alert
//     //                     message={<span className="text-red-400">{errors.email?.message}</span>}
//     //                     type="error"
//     //                   />
//     //                 </div>
//     //               )}
//     //             </>
//     //           )}
//     //         />
//     //       </Space>
//     //       <Button
//     //         size="large"
//     //         className="w-full bg-blue-500 text-white mt-4"
//     //         htmlType="submit"
//     //         loading={loading}
//     //       >
//     //         Send Link
//     //       </Button>
//     //     </form>
//     //   </div>
//     // </section>
//   );
// }

// export default ForgotPassword;

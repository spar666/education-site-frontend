// import { gql, useLazyQuery } from "@apollo/client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Alert, Button, Card, Spin, notification } from "antd";
// import PublicPages from "apps/sc-admin/components/PublicPages";
// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// const VERIFY_EMAIL = gql`
//   query ($token: String!) {
//     verifyEmail(token: $token) {
//       status
//       message
//     }
//   }
// `;

// const RESEND_VERIFY_EMAIL = gql`
//   query ($email: String!) {
//     resendVerificationEmail(email: $email) {
//       status
//       message
//     }
//   }
// `;

// const verificationSchema = z.object({
//   email: z
//     .string({ invalid_type_error: "Email is required" })
//     .nonempty({ message: "Email is required" })
//     .email(),
// });

// function verifyEmail() {
//   const router = useRouter();
//   const { token } = router.query;

//   const [verifyEmail, { data }] = useLazyQuery(VERIFY_EMAIL, {
//     variables: { token },
//   });
//   const error = String(data?.verifyEmail?.status)?.startsWith("4");

//   const [resendEmail, { data: resendData, loading: resendLoading }] = useLazyQuery(
//     RESEND_VERIFY_EMAIL,
//     { fetchPolicy: "no-cache" }
//   );
//   const resendError = String(resendData?.resendVerificationEmail?.status)?.startsWith("4");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       email: "",
//     },
//     resolver: zodResolver(verificationSchema),
//   });

//   function handleResend(email) {
//     resendEmail({ variables: email, fetchPolicy: "no-cache" }).then(({ data }: any) => {
//       if (String(data?.resendVerificationEmail?.status).startsWith("20")) {
//         notification.success({
//           message: data?.resendVerificationEmail?.message || "Verification email send successfully",
//         });
//       } else {
//         notification.error({
//           message: data?.resendVerificationEmail?.message || "Verification email failed",
//         });
//       }
//     });
//   }

//   useEffect(() => {
//     token && verifyEmail();
//   }, [token]);

//   useEffect(() => {
//     if (data) {
//       if (String(data?.verifyEmail?.status).startsWith("40")) {
//         notification.error({
//           message: data?.verifyEmail?.message || "The link is either expired or invalid",
//         });
//       } else {
//         notification.success({
//           message: data?.verifyEmail?.message || "Your Email has been verified ",
//         });
//         router.push("/");
//       }
//     }
//   }, [data]);

//   return <PublicPages title="Verify Email">{renderContionalComponent()}</PublicPages>;

//   function renderContionalComponent() {
//     if (error || resendError) return <ErrorComponent />;
//     if (data || resendData) return <SuccessComponent />;
//     return <LoadingComponent />;
//   }

//   function ErrorComponent() {
//     return (
//       <Card size="small" className="xs:w-full p-10 bg-[#FFFBE6]">
//         <h1 className="text-xl font-semibold text-[#FF4D4F]">Token expired or invalid!</h1>
//         <h1 className="text-sm ">Please re-enter your email for a new token.</h1>
//         <form className="flex flex-col" onSubmit={handleSubmit(handleResend)}>
//           <input
//             {...register("email")}
//             placeholder="Email"
//             className="h-[55px] border px-2 py-3 my-4"
//           />
//           {errors?.email?.message && (
//             <div className="mt-1 mb-4">
//               <Alert message={errors?.email?.message} type="error" />
//             </div>
//           )}
//           <Button
//             size="large"
//             htmlType="submit"
//             className="bg-blue-500 text-white"
//             loading={resendLoading}
//           >
//             Resend Email
//           </Button>
//         </form>
//       </Card>
//     );
//   }

//   function SuccessComponent() {
//     return (
//       <Alert
//         className="!items-center text-center"
//         message="Your email has been verified"
//         description="Please hold while we redirect you to homepage..."
//         type="success"
//         showIcon
//       />
//     );
//   }

//   function LoadingComponent() {
//     return (
//       <Alert
//         className="text-center !items-center"
//         message={
//           <>
//             <Spin />
//             <span className="ml-3">Verifying your email address</span>
//           </>
//         }
//         description="Please hold while we verify your email"
//         type="success"
//       />
//     );
//   }
// }

// export default verifyEmail;

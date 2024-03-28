// import { Button } from 'antd';
// import { Content } from 'antd/lib/layout/layout';
// import SCInput from 'apps/admin/components/SCForm/SCInput';
// import JTLoader from 'apps/admin/components/SCLoader';

// import { useRouter } from 'next/router';
// import React from 'react';

// function BlogCategoryForm({
//   handleSubmit,
//   control,
//   errors,
//   onSubmit,
//   id,
//   loading,
// }: any) {
//   const router = useRouter();
//   return (
//     <>
//       {/* <JTLoader visible={loading} /> */}
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <JTLoader visible={loading} />
//         <Content className="bg-white p-10 rounded-md">
//           <h3 className="text-xl font-bold mb-6">
//             {id ? 'Edit' : 'Add'} Blog Category
//           </h3>
//           <SCInput
//             name="category"
//             control={control}
//             label="Category title"
//             parentClass="flex-grow"
//             error={errors?.category?.message}
//             size="large"
//             placeholder="category"
//             maxLength={100}
//             inputfieldClass="mt-2"
//             required
//           />
//           <div className="flex mt-4">
//             <Button
//               loading={loading}
//               htmlType="submit"
//               type="primary"
//               size="large"
//             >
//               {id ? 'Update' : 'Create'}
//             </Button>
//             <Button
//               type="ghost"
//               onClick={() => router.push('/blogs/category')}
//               className="ml-4"
//               size="large"
//             >
//               Cancel
//             </Button>
//           </div>
//         </Content>
//       </form>
//     </>
//   );
// }

// export default BlogCategoryForm;

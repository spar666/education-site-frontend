// import { Controller, Control } from "react-hook-form";
// import { Select, Alert, SelectProps } from "antd";

// const { Option, OptGroup } = Select;

// type SCSelectGroupTypes = SelectProps & {
//   name: string;
//   control: Control<any>;
//   options: {
//     id: string;
//     title: string;
//     subArray: { value: string; label: string };
//   }[];
//   label?: React.ReactNode;
//   error?: React.ReactNode;
//   parentClass?: string;
//   labelClass?: string;
//   required?: boolean;
// };

// const SCSelectGroup = ({
//   name,
//   control,
//   options,
//   label,
//   error,
//   parentClass,
//   labelClass,
//   required = false,
//   ...rest
// }: SCSelectGroupTypes) => {
//   return (
//     <div className={parentClass}>
//       {label && (
//         <label className={labelClass}>
//           {label}
//           {required && "*"}
//         </label>
//       )}
//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <Select className="w-full" {...field} {...rest} id={name}>
//             {options?.map((main) => {
//               return (
//                 <OptGroup key={main.id} label={main.title}>
//                   {main?.subArray?.map(({ value, label }) => {
//                     return <Option key={value}>{label}</Option>; // TODO: better RNG key value
//                   })}
//                 </OptGroup>
//               );
//             })}
//           </Select>
//         )}
//       />
//       {error && (
//         <div className="mt-2">
//           <Alert message={error} type="error" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SCSelectGroup;

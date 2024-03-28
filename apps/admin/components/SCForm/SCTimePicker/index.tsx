// import { InputProps, Alert, TimePicker } from "antd";
// import { Control, Controller } from "react-hook-form";
// import moment from "moment";

// type SCTimePickerType = InputProps & {
//   name: string;
//   control: Control<any>;
//   label?: React.ReactNode;
//   error?: React.ReactNode;
//   parentClass?: string;
//   labelClass?: string;
//   required?: boolean;
//   // onChange: (value) => void;
// };
// const SCTimePicker = ({
//   name,
//   control,
//   label,
//   error,
//   parentClass,
//   labelClass,
//   required = false,
//   // onChange,
//   ...rest
// }: SCTimePickerType) => {
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
//           <TimePicker
//             {...field}
//             id={name}
//             value={field.value ? moment(field.value) : null}
//             // onChange={(value, value2) => {
//             //   onChange(new Date(value2));
//             // }}
//           />
//         )}
//       />
//       {error && (
//         <div className=" mt-2">
//           <Alert message={error} type="error" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SCTimePicker;

// import { InputProps, Alert, DatePicker } from "antd";
// import { Control, Controller } from "react-hook-form";
// import moment from "moment";

// type SCDatePickerTypes = InputProps & {
//   name: string;
//   control: Control<any>;
//   label?: any;
//   error?: any;
//   parentClass?: string;
//   labelClass?: string;
//   required?: boolean;
//   onChange: (value) => void;
//   disabledDate?: (current) => boolean;
// };
// const SCDatePicker = ({
//   name,
//   control,
//   label,
//   error,
//   parentClass,
//   labelClass,
//   required = false,
//   onChange,
//   disabledDate,
//   ...rest
// }: SCDatePickerTypes) => {
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
//           <DatePicker
//             {...field}
//             id={name}
//             value={field.value ? moment(field.value) : null}
//             onChange={(value, value2) => {
//               onChange(new Date(value2));
//             }}
//             disabledDate={disabledDate}
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

// export default SCDatePicker;

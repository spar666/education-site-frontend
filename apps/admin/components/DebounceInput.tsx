// import { Input, InputProps } from "antd";
// import { debounce } from "lodash";
// import { useCallback, useState } from "react";

// interface IProps {
//   allowClear?: boolean;
//   text?: string;
//   size?: string;
//   time?: number;
//   callback: (text: string) => void;
// }

// function DebounceInput({
//   text = "",
//   time = 1200,
//   size = "small",
//   allowClear = true,
//   callback,
//   ...rest
// }: InputProps & IProps) {
//   const [value, setValue] = useState(text);
//   const debouncedFn = useCallback(debounce(callback, time), []);

//   function handleChange(e) {
//     setValue(e.target.value);
//     debouncedFn(e.target.value);
//   }

//   return (
//     <Input {...rest} allowClear={allowClear} size={size} value={value} onChange={handleChange} />
//   );
// }

// export default DebounceInput;

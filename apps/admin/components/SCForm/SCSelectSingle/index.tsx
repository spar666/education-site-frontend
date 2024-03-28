import { Controller, Control } from "react-hook-form";
import { Select, Alert, SelectProps } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

type SCSelectSingleTypes = SelectProps & {
  name: string;
  control: Control<any>;
  options: { value: string | number; label: string | number }[];
  label?: React.ReactNode;
  error?: React.ReactNode;
  parentClass?: string;
  disableOptions?: boolean;
  labelClass?: string;
  required?: boolean;
};

const SCSelectSingle = ({
  name,
  control,
  options,
  label,
  error,
  disableOptions,
  parentClass,
  labelClass,
  required = false,
  ...rest
}: SCSelectSingleTypes) => {
  const [selectValue, setSelectValue] = useState(options);
  const onSearch = (value: string) => {
    const newObj = { value: value, label: value }; // making new onject for options
    setSelectValue([...options, newObj]);
  };

  useEffect(() => {
    setSelectValue(options);
  }, [options]);

  return (
    <div className={parentClass}>
      {label && (
        <label className={labelClass}>
          {label}
          {required && "*"}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select className="w-full" onSearch={onSearch} {...field} showSearch {...rest} id={name}>
            {selectValue?.map(({ value, label, isDisable }) => {
              return (
                <Option key={value} disabled={disableOptions && isDisable}>
                  {label}
                </Option>
              ); // TODO: better RNG key value
            })}
          </Select>
        )}
      />
      {error && (
        <div className="mt-2">
          <Alert message={error} type="error" />
        </div>
      )}
    </div>
  );
};

export default SCSelectSingle;

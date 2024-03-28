import { Controller, Control } from 'react-hook-form';
import { Select, Alert, SelectProps } from 'antd';

const { Option } = Select;

type SCSelectTypes = SelectProps & {
  name: string;
  control: Control<any>;
  options: { value: string | number; label: string | number }[];
  label?: any;
  error?: any;
  parentClass?: string;
  disableOptions?: boolean;
  labelClass?: string;
  required?: boolean;
  register: any;
};

const SCSelect = ({
  name,
  control,
  options,
  label,
  error,
  disableOptions,
  parentClass,
  labelClass,
  required = false,
  register,

  ...rest
}: SCSelectTypes) => {
  return (
    <div className={parentClass}>
      {label && (
        <label className={labelClass}>
          {label}
          {required && '*'}
        </label>
      )}
      <Controller
        {...register(name)}
        name={name}
        control={control}
        render={({ field }) => (
          <Select className="w-full" {...field} {...rest} id={name}>
            {options?.map(({ value, label, isDisable }) => {
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

export default SCSelect;

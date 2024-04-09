import { Controller, Control } from 'react-hook-form';
import { Radio, Alert, Space, Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
const { Group } = Checkbox;

type SCCheckboxTypes = {
  name: string;
  control: Control<any>;
  options: {
    value: string | number;
    label: string | number;
    description: string | number;
  }[];
  label?: React.ReactNode;
  error?: React.ReactNode;
  parentClass?: string;
  labelClass?: string;
  vertical?: boolean;
  horizontal?: boolean;
  register: any;
};
const SCCheckbox = ({
  name,
  control,
  options,
  label,
  error,
  parentClass,
  register,
  labelClass,
  horizontal,
  ...rest
}: SCCheckboxTypes) => {
  return (
    <div className={parentClass}>
      <Controller
        {...register(name)}
        name={name}
        control={control}
        render={({ field }) => (
          <div>
            {label && <span className={labelClass}>{label}</span>}
            <Group
              {...field}
              {...rest}
              options={options}
              defaultValue={field.value}
              style={{ display: horizontal ? 'flex' : 'block' }}
            >
              {options?.map(({ value, label, description }, index) => (
                <Space key={index} className="flex px-3 py-1">
                  <Checkbox value={value} id={value.toString()}>
                    <h3 className="font-semibold">{label}</h3>
                    <h3 className=" mt-1 px-2 text-[#969393]">
                      {'(' + description + ')'}
                    </h3>
                  </Checkbox>
                </Space>
              ))}
            </Group>
          </div>
        )}
      />
      {error && <Alert message={error} type="error" />}
    </div>
  );
};

export default SCCheckbox;

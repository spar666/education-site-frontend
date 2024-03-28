import { Controller, Control } from "react-hook-form";
import { Radio, Alert } from "antd";
const { Group } = Radio;

type JTRadioTypes = {
  name: string;
  control: Control<any>;
  options: { value: string | number | boolean; label: string | number }[];
  label?: React.ReactNode;
  error?: React.ReactNode;
  parentClass?: string;
  labelClass?: string;
};

const JTRadio = ({
  name,
  control,
  options,
  label,
  error,
  parentClass,
  labelClass,
  ...rest
}: JTRadioTypes) => {
  return (
    <div className={parentClass}>
      {label && <label className={labelClass}>{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Group {...field} {...rest} id={name}>
            {options?.map(({ value, label }, index) => (
              <Radio value={value} key={index} id={value.toString()}>
                {label}
              </Radio>
            ))}
          </Group>
        )}
      />
      {error && <Alert message={error} type="error" />}
    </div>
  );
};

export default JTRadio;

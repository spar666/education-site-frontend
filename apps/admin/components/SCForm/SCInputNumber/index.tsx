import { Controller, Control } from "react-hook-form";
import { InputNumber, Alert, InputNumberProps } from "antd";

type SCInputNumberTypes = InputNumberProps & {
  name: string;
  control: Control<any>;
  label?: React.ReactNode;
  error?: React.ReactNode;
  parentClass?: string;
  labelClass?: string;
  required?: boolean;
  max?: number;
  min?: number;
};

const SCInputNumber = ({
  name,
  control,
  label,
  error,
  parentClass,
  labelClass,
  required = false,
  max,
  min,
  ...rest
}: SCInputNumberTypes) => {
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
          <InputNumber
            // @ts-ignore
            onWheel={(e) => e?.target?.blur()}
            id={name}
            type="number"
            className="flex-grow"
            max={max}
            min={min}
            style={{ width: "100%" }}
            {...field}
            {...rest}
          />
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

export default SCInputNumber;

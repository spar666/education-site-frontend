import { Controller, Control } from "react-hook-form";
import { Alert, Switch } from "antd";

type SCSwitchTypes = {
  name: string;
  control: Control<any>;
  label?: React.ReactNode;
  disabled?: boolean;
  error?: React.ReactNode;
  parentClass?: string;
  labelClass?: string;
};

const SCSwitch = ({
  name,
  control,
  label,
  error,
  parentClass,
  labelClass,
  ...rest
}: SCSwitchTypes) => {
  return (
    <div className={parentClass}>
      {label && <label className={labelClass}>{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch size="small" checked={field.value} onChange={field.onChange} id={name} />
        )}
      />
      {error && <Alert message={error} type="error" />}
    </div>
  );
};

export default SCSwitch;

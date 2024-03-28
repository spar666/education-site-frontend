import { Controller, Control } from 'react-hook-form';
import { Input, Alert } from 'antd';
import { TextAreaProps } from 'antd/lib/input';

const { TextArea } = Input;

type SCTextAreaTypes = TextAreaProps & {
  name: string;
  control: Control<any>;
  label?: any;
  error?: any;
  parentClass?: string;
  labelClass?: string;
  required?: boolean;
  register: any;
};

const SCTextArea = ({
  name,
  control,
  label,
  error,
  parentClass,
  labelClass,
  required = false,
  register,
  ...rest
}: SCTextAreaTypes) => {
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
        render={({ field }) => <TextArea {...field} {...rest} id={name} />}
      />
      {error && (
        <div className="mt-2">
          <Alert message={error} type="error" />
        </div>
      )}
    </div>
  );
};

export default SCTextArea;

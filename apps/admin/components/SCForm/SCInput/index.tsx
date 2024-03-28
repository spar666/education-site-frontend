import React from 'react';
import { Alert, Input, InputNumber, InputProps } from 'antd';
import { Control, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const defaultCountry = 'np';

const inputTypeSwitcher = ({ type, id, className, ...rest }: any) => {
  let component;
  switch (type) {
    case 'normal':
      component = <Input {...rest} />;
      break;
    case 'phone':
      component = (
        <PhoneInput
          inputStyle={{ width: '100%', height: '40px' }}
          containerStyle={{ width: '100%' }}
          {...rest}
          country={defaultCountry}
          inputProps={{
            id: rest.id,
          }}
        />
      );
      break;
    case 'password':
      component = <Input.Password {...rest} />;
      break;
    case 'number':
      component = <InputNumber {...rest} />;
      break;
    default:
      component = <Input {...rest} />;
      break;
  }
  return component;
};

type SCInputTypes = InputProps & {
  name: string;
  type?: 'normal' | 'phone' | 'password' | 'number';
  control: Control<any>;
  label?: any;
  error?: any;
  parentClass?: string;
  labelClass?: string;
  maxLength?: number;
  required?: boolean;
  inputfieldClass?: string;
  rules?: any;
  register: any;
  placeholder: string;
};

const SCInput = ({
  name,
  type = 'normal',
  control,
  label,
  error,
  inputfieldClass,
  parentClass,
  labelClass,
  required = false,
  showCount,
  rules = null,
  register,
  placeholder,
  ...rest
}: SCInputTypes) => {
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
        render={({ field }) => inputTypeSwitcher({ ...field, type, ...rest })}
        rules={rules}
      />
      {error && (
        <div className="mt-2">
          <Alert message={error} type="error" />
        </div>
      )}
    </div>
  );
};

export default SCInput;

import React, { forwardRef } from 'react';
import { Alert } from 'antd';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import { Controller } from 'react-hook-form';

const SCWysiwyg = forwardRef(
  (
    {
      name,
      control,
      label,
      labelClass,
      required,
      error,
      register,
      ...rest
    }: any,
    ref
  ) => {
    return (
      <div className="mb-4">
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
          defaultValue={null}
          render={({ field: { value, onChange } }) => {
            return (
              <FroalaEditorComponent
                model={value}
                onModelChange={onChange}
                tag="textarea"
                {...rest}
                ref={ref} // Attach the ref to FroalaEditorComponent
              />
            );
          }}
        />

        {error && (
          <div className="mt-2">
            <Alert message={error} type="error" />
          </div>
        )}
      </div>
    );
  }
);

export default SCWysiwyg;

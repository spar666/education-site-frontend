// import dynamic from 'next/dynamic';
// import { Controller, Control } from 'react-hook-form';
// import { Alert } from 'antd';
// import React, { useState, useRef, useEffect } from 'react';

// export const ReactQuill = dynamic(
//   async () => {
//     const { default: RQ } = await import('react-quill');

//     // for some reason react quill doesn't accept direct reference and we gotta do like this
//     // eslint-disable-next-line react/display-name
//     return ({
//       forwardedRef,
//       ...props
//     }: {
//       id;
//       forwardedRef;
//       modules;
//       formats;
//       className;
//       placeholder;
//       onKeyDown;
//     }) => <RQ ref={forwardedRef} {...props} />;
//   },
//   {
//     ssr: false,
//   }
// );

// const modules = {
//   toolbar: [
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     ['link'],
//   ],
//   clipboard: {
//     // toggle to add extra line breaks when pasting HTML:
//     matchVisual: false,
//   },
// };

// const formats = [
//   'header',
//   'font',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
//   'video',
// ];

// type SCEditorTypes = {
//   name: string;
//   control: Control<any>;
//   label?: React.ReactNode;
//   error?: React.ReactNode;
//   parentClass?: string;
//   labelClass?: string;
//   editorClass?: string;
//   placeholder?: string;
//   maxLength?: number;
//   required?: boolean;
//   setError?: (str) => void;
//   setState?;
//   funcOk?;
// };

// const SCEditor = ({
//   name,
//   control,
//   label,
//   error,
//   parentClass,
//   labelClass,
//   editorClass,
//   placeholder,
//   maxLength,
//   required = false,
//   setError,
//   setState,
//   funcOk,
//   ...rest
// }: SCEditorTypes) => {
//   const [charCount, setCharCount] = useState(0);
//   const [countError, setCountError] = useState('');
//   const reactQuillRef = useRef();

//   const checkCharacterCount = (event) => {
//     if (maxLength) {
//       const editor = (reactQuillRef as any).current.getEditor();
//       const unprivilegedEditor = (
//         reactQuillRef as any
//       ).current.makeUnprivilegedEditor(editor);
//       setCharCount(maxLength - unprivilegedEditor.getLength());
//       if (
//         unprivilegedEditor.getLength() > maxLength &&
//         event.key !== 'Backspace'
//       ) {
//         setCountError(
//           `Content should not be more than ${maxLength} characters`
//         );
//         event.preventDefault();
//       }
//     }
//   };

//   useEffect(() => {
//     funcOk && setState((reactQuillRef as any)?.current);
//   }, []);

//   return (
//     <div className={parentClass}>
//       {label && (
//         <label className={labelClass}>
//           {label}
//           {required && '*'}
//         </label>
//       )}
//       <Controller
//         name={name}
//         control={control}
//         defaultValue={null}
//         render={({ field }) => (
//           <ReactQuill
//             {...rest}
//             {...field}
//             id={name}
//             modules={modules}
//             formats={formats}
//             className={editorClass}
//             placeholder={placeholder}
//             forwardedRef={reactQuillRef}
//             onKeyDown={checkCharacterCount}
//           />
//         )}
//       />
//       {error && (
//         <div className="mt-2">
//           <Alert message={error || countError} type="error" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SCEditor;

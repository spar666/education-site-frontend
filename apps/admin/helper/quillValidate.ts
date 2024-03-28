export const quillValidate = (data: string) => {
  // this regex return false if the data contain only paragraph tag or paragraph tag that contain only one brek or multiple brek tags only
  // <p></p>  && <p><br></p> && <p><br><br></p> and so on
  // const regex = /^(?!<p>\s*(?:<br\s*\/?>\s*)*<\/p>\s*$)<p>(?!<br\s*\/?>)\s*.*\s*<\/p>\s*$/;
  // const regexOderList = /^<(o|u)l>.*<\/(o|u)l>$/;
  // const isTrue = regex.test(data) || regexOderList.test(data) ? true : false;
  // return isTrue;
  if (!data) {
    return false;
  }
  return data?.replace(/<(.|\n)*?>/g, "")?.trim()?.length !== 0;
};

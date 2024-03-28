export type BlogsType = {
  id?: string | string[] | null;
  title: string | null;
  tags?: Array<string> | null;
  contents: string | null;
  coverImage?: Array<any> | null;
  images?: Array<any> | null;
};

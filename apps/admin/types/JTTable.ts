type JTColumnType = {
  title: string;
  dataIndex: string;
  key: string;
  slug: string;
  align?: string;
  sorter?: ({a, b}:any) => void;
  render?: ({data}:any) => void;
};

export type { JTColumnType };

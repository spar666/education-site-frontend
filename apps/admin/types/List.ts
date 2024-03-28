export type BasicListType = {
  data: {
    items: Array<{
      id: string;
      title?: string;
      name?: string;
      slug?: string;
      user?: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber1: string;
      };
    }>;
    meta: {
      totalItems: 1;
      itemCount: 1;
      totalPages: 1;
      currentPage: 1;
    };
  };
};

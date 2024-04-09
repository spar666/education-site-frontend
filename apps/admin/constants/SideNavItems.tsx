const SideNavItems = [
  {
    key: 1,
    icon: null,
    name: 'Dashboard',
    path: '/dashboard',
  },

  {
    key: 3,
    icon: null,
    name: 'Course Management',
    path: '/dashboard-course',
    // role: [ROLES.SUPERADMIN],
    children: [
      {
        key: 2,
        icon: null,
        label: 'Course',
        path: '/course',
      },
    ],
  },
  {
    key: 4,
    icon: null,
    name: 'University Mangement',
    path: '/dashboard-university',
    children: [
      {
        key: 2,
        icon: null,
        label: 'University',
        path: '/university',
      },
    ],
  },
  {
    key: 5,
    icon: null,
    name: 'Students',
    path: '/students',
  },

  // {
  //   key: 6,
  //   icon: null,
  //   name: 'FAQs',
  //   path: '/faqs',
  // },

  {
    key: 6,
    icon: null,
    name: 'Blogs',
    path: '/blogs',
  },
  {
    key: 7,
    icon: null,
    name: 'Add User',
    path: '/user',
  },
  // {
  //   key: 6,
  //   icon: null,
  //   name: "Blogs",
  //   path: "/blogs",
  //   children: [
  //     {
  //       key: 7,
  //       icon: null,
  //       label: "Blogs List",
  //       path: "/blogs",
  //     },
  //     {
  //       key: 8,
  //       icon: null,
  //       label: "Blog Categories",
  //       path: "/blogs/category",
  //     },
  //   ],
  // },
];

export default SideNavItems;

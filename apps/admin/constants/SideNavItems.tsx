const SideNavItems = [
  {
    key: 1,
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
      {
        key: 2,
        icon: null,
        label: 'Course Category',
        path: '/course-category',
      },
      {
        key: 3,
        icon: null,
        label: 'Study Levels',
        path: '/study-levels',
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

  {
    key: 8,
    icon: null,
    name: 'Faq',
    path: '/faq',
  },

  {
    key: 9,
    icon: null,
    name: 'Content Management',
    children: [
      {
        key: 1,
        icon: null,
        label: 'About Us',
        path: '/about',
      },
      {
        key: 2,
        icon: null,
        label: 'Banner',
        path: '/banner',
      },

      {
        key: 3,
        icon: null,
        label: 'Service',
        path: '/service',
      },
    ],
  },

  {
    key: 10,
    icon: null,
    name: 'Destination',
    path: '/destination',
  },
];

export default SideNavItems;

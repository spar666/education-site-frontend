'use client';
import { LogoutOutlined } from '@ant-design/icons';
import { Menu, MenuProps, theme } from 'antd';
import Sider from 'antd/lib/layout/Sider';

import { usePathname, useRouter } from 'next/navigation';
import items from '../../constants/SideNavItems';
import { deleteCookie } from 'cookies-next';

export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  // const [logout] = useMutation(LOGOUT);

  function logoutHandler() {
      localStorage.removeItem('token');
    window.location.reload();
  }

  // }

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'logout' && e.key !== 'logo' && e.key !== 'underline') {
      router.push(e.key);
    }
  };

  const menuItems = [
    ...items?.map(({ icon, name, path, children }) => ({
      key: path,
      label: name,

      // onClick: () => router.push(path),
      icon,

      children: children
        ? children.map((child) => ({
            key: child.path,
            path: child.path,
            label: child.label,
            icon: child.icon,
          }))
        : null,
    })),
    // for permissions
  ];

  const menu = [
    {
      key: 'logo',
      // label: <NavLogo onClick={() => router.push("/")} />,
      style: { height: 'unset' },
    },
    ...menuItems,
    {
      key: 'sider-menu-spacing',
      style: { flexGrow: 1 },
    },
    {
      key: 'logout',
      label: <p>Logout</p>,
      onClick: logoutHandler,
      icon: (
        <LogoutOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
  ];

  function defaultOpenMenu() {
    let openKeys = [];
    // Users
    if (pathname === '/dashboard-users' || pathname === '/customer-services') {
      openKeys.push('/dashboard-users');
    }
    // User Management
    if (pathname === '/roles' || pathname === '/permissions') {
      openKeys.push('/user-role');
    }

    return openKeys;
  }

  return (
    <Sider className="sc_sidebar" breakpoint="lg" collapsedWidth={0}>
      <Menu
        defaultOpenKeys={defaultOpenMenu()}
        items={menu}
        id="menu-bar"
        onClick={onClick}
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        className="min-h-screen overflow-hidden flex flex-col sticky top-0"
      />
    </Sider>
  );
}

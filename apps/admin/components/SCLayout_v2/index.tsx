'use client';
import { Layout } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Head from './Head';
import useUser from 'apps/admin/store/useUser';
import { SideBar } from './SideBar';

const { Content, Footer } = Layout;

type AdminLayoutProps = {
  title?: string;
  authProtected?: boolean;
  showTitle?: boolean;
};

function CopyrightComponent() {
  return (
    <div className={'text-center'}>
      © 2023-{new Date().getFullYear()} Study Courses. All rights reserved.
    </div>
  );
}

export function NavLogo({ onClick }: any) {
  return (
    <div
      className="logo flex p-3 items-center justify-center"
      onClick={onClick}
    >
      <h1 className={'text-white pl-1'}>Study Course</h1>
    </div>
  );
}

const AdminLayout = ({
  children,
  showTitle,
  title = 'Study Course',
}: React.PropsWithChildren<AdminLayoutProps>) => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useUser();

  console.log(isAuthenticated, 'isauthnciated');

  const isCalenderSection = () => pathname === '/guides/calender/[id]';

  return (
    <>
      <Head title={title} />
      <Layout className="min-h-screen" hasSider>
        {isAuthenticated && <SideBar />}
        <Layout className="h-auto">
          <Content
            className={`${
              isCalenderSection()
                ? 'calender-padding'
                : isAuthenticated
                ? 'px-20 pt-10'
                : ''
            } h-auto`}
          >
            {showTitle && <h1 className="text-3xl font-bold">{title}</h1>}
            {children}
          </Content>
          <Footer>
            <CopyrightComponent />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminLayout;

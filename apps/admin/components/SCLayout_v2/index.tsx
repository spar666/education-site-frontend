'use client';

import React, { useMemo } from 'react';
import { Layout } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import Head from './Head';
import useUser from 'apps/admin/store/useUser';
import { SideBar } from './SideBar';

const { Content, Footer } = Layout;

type AdminLayoutProps = {
  title?: string;
  authProtected?: boolean;
  showTitle?: boolean;
  children: React.ReactNode;
};

function CopyrightComponent() {
  return (
    <div className="text-center">
      © 2023-{new Date().getFullYear()} Study & Visa. All rights reserved.
    </div>
  );
}

export function NavLogo({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="logo flex p-3 items-center justify-center"
      onClick={onClick}
    >
      <h1 className="text-white pl-1">Study & Visa</h1>
    </div>
  );
}

const AdminLayout = ({
  children,
  showTitle = false,
  title = 'Study Course',
}: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useUser();
  console.log(isAuthenticated, 'user');

  const isCalendarSection = useMemo(
    () => pathname === '/guides/calender/[id]',
    [pathname]
  );

  return (
    <>
      <Head title={title} />
      <Layout className="min-h-screen" hasSider>
        {isAuthenticated && <SideBar />}
        <Layout className="h-auto">
          <Content
            className={`${
              isCalendarSection
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

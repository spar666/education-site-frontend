import React from 'react';
import Navbar from '../v2/Navbar';
import Footer from '../v2/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default StudentLayout;

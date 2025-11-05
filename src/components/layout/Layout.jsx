import React from 'react';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">© 2025 Carbon Credit Marketplace. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-2">Nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

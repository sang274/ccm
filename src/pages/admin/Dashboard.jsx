import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { Users, DollarSign, TrendingUp, FileText } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard - Admin</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Chào mừng, {user?.fullName || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Người dùng</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Giao dịch</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Doanh thu</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$0</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-orange-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Báo cáo</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Users className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Người dùng</h3>
            <p className="text-blue-100">Quản lý người dùng hệ thống</p>
          </Link>

          <Link
            to="/admin/transactions"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <DollarSign className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Giao dịch</h3>
            <p className="text-green-100">Theo dõi các giao dịch</p>
          </Link>

          <Link
            to="/admin/wallets"
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <TrendingUp className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ví điện tử</h3>
            <p className="text-purple-100">Quản lý ví và dòng tiền</p>
          </Link>

          <Link
            to="/admin/listings"
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Niêm yết</h3>
            <p className="text-orange-100">Quản lý niêm yết tín chỉ</p>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Báo cáo</h3>
            <p className="text-indigo-100">Xuất báo cáo tổng hợp</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

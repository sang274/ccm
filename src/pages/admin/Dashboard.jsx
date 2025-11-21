import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { Users, DollarSign, TrendingUp, FileText } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="animate-fadeInUp">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard - Admin</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Chào mừng, {user?.fullName || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fadeInUp animation-delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Người dùng</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-110 transition-transform">0</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fadeInUp animation-delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Giao dịch</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-110 transition-transform">0</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full group-hover:bg-green-500 dark:group-hover:bg-green-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fadeInUp animation-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Doanh thu</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-110 transition-transform">$0</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full group-hover:bg-purple-500 dark:group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer animate-fadeInUp animation-delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Báo cáo</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:scale-110 transition-transform">0</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full group-hover:bg-orange-500 dark:group-hover:bg-orange-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fadeInUp animation-delay-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <Users className="h-12 w-12 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">Người dùng</h3>
              <p className="text-blue-100 group-hover:text-white transition-colors">Quản lý người dùng hệ thống</p>
            </div>
          </Link>

          <Link
            to="/admin/transactions"
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fadeInUp animation-delay-600"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <DollarSign className="h-12 w-12 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">Giao dịch</h3>
              <p className="text-green-100 group-hover:text-white transition-colors">Theo dõi các giao dịch</p>
            </div>
          </Link>

          <Link
            to="/admin/wallets"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fadeInUp animation-delay-700"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <TrendingUp className="h-12 w-12 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">Ví điện tử</h3>
              <p className="text-purple-100 group-hover:text-white transition-colors">Quản lý ví và dòng tiền</p>
            </div>
          </Link>

          <Link
            to="/admin/listings"
            className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fadeInUp animation-delay-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <FileText className="h-12 w-12 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">Niêm yết</h3>
              <p className="text-orange-100 group-hover:text-white transition-colors">Quản lý niêm yết tín chỉ</p>
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fadeInUp animation-delay-900"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <FileText className="h-12 w-12 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">Báo cáo</h3>
              <p className="text-indigo-100 group-hover:text-white transition-colors">Xuất báo cáo tổng hợp</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

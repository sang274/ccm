import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Award, TrendingUp, Package } from 'lucide-react';

export const BuyerDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Người mua</h1>
          <p className="text-gray-600 mt-2">Chào mừng, {user?.fullName || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tín chỉ đã mua</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chứng nhận</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$0</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giao dịch</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/buyer/marketplace"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <ShoppingCart className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Thị trường</h3>
            <p className="text-blue-100">Mua tín chỉ carbon</p>
          </Link>

          <Link
            to="/buyer/my-purchases"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Package className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Đã mua</h3>
            <p className="text-green-100">Xem các giao dịch đã mua</p>
          </Link>

          <Link
            to="/buyer/certificates"
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Award className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Chứng nhận</h3>
            <p className="text-purple-100">Quản lý chứng nhận của bạn</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

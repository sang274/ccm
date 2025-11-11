// src/pages/cva/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export const CVADashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - CVA</h1>
          <p className="text-gray-600 mt-2">Chào mừng, {user?.fullName || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xác minh</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Báo cáo</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/cva/verifications"
            className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Clock className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Xác minh</h3>
            <p className="text-yellow-100">Duyệt yêu cầu phát hành tín chỉ</p>
          </Link>

          <Link
            to="/cva/reports"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Báo cáo</h3>
            <p className="text-blue-100">Xuất báo cáo xác minh</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

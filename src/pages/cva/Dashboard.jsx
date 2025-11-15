// src/pages/cva/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext'; // ← THÊM DÒNG NÀY
import { apiClient } from '../../services/api';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export const CVADashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme(); // ← LẤY THEME HIỆN TẠI
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    reports: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/cva/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi tải thống kê:', err);
      }
    };
    fetchStats();
  }, []);

  // Class chung cho card thống kê
  const cardBase = "rounded-xl shadow-md p-6 border-l-4 transition-all duration-300";
  const textMuted = "text-sm font-medium text-gray-600 dark:text-gray-400";
  const textValue = "text-3xl font-bold text-gray-900 dark:text-white";

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard - CVA
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Chào mừng, {user?.fullName || user?.email}
          </p>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chờ xác minh */}
          <div className={`${cardBase} border-yellow-500 bg-white dark:bg-gray-800`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={textMuted}>Chờ xác minh</p>
                <p className={textValue}>{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Đã duyệt */}
          <div className={`${cardBase} border-green-500 bg-white dark:bg-gray-800`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={textMuted}>Đã duyệt</p>
                <p className={textValue}>{stats.approved}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Đã từ chối */}
          <div className={`${cardBase} border-red-500 bg-white dark:bg-gray-800`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={textMuted}>Đã từ chối</p>
                <p className={textValue}>{stats.rejected}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Báo cáo */}
          <div className={`${cardBase} border-blue-500 bg-white dark:bg-gray-800`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={textMuted}>Báo cáo</p>
                <p className={textValue}>{stats.reports}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/cva/verifications"
            className={`
              bg-gradient-to-br from-yellow-500 to-orange-600 
              rounded-xl shadow-lg p-6 text-white 
              hover:shadow-xl transition-all duration-300 
              flex flex-col items-start
              ${theme === 'dark' ? 'hover:from-yellow-600 hover:to-orange-700' : ''}
            `}
          >
            <Clock className="h-12 w-12 mb-4 text-yellow-100" />
            <h3 className="text-xl font-bold mb-2">Xác minh</h3>
            <p className="text-yellow-100">Duyệt yêu cầu phát hành tín chỉ</p>
          </Link>

          <Link
            to="/cva/reports"
            className={`
              bg-gradient-to-br from-blue-500 to-cyan-600 
              rounded-xl shadow-lg p-6 text-white 
              hover:shadow-xl transition-all duration-300 
              flex flex-col items-start
              ${theme === 'dark' ? 'hover:from-blue-600 hover:to-cyan-700' : ''}
            `}
          >
            <FileText className="h-12 w-12 mb-4 text-blue-100" />
            <h3 className="text-xl font-bold mb-2">Báo cáo</h3>
            <p className="text-blue-100">Xuất báo cáo xác minh</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
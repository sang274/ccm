import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { vehicleService } from '../../services/vehicleService';
import { carbonCreditService } from '../../services/carbonCreditService';
import { Car, Leaf, Wallet, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const EVOwnerDashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [walletData, vehiclesData, creditsData] = await Promise.all([
          walletService.getByUserId(user.id),
          vehicleService.getByUserId(user.id),
          carbonCreditService.getAll(1, 100),
        ]);

        setWallet(walletData);
        setVehicles(vehiclesData);
        setCredits(creditsData.filter((c) => c.ownerId === user.id));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  const totalCredits = credits.reduce((sum, c) => sum + (c.availableUnits || 0), 0);
  const totalRevenue = wallet?.fiatBalance || 0;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Chào mừng trở lại, {user?.fullName || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Số xe điện</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{vehicles.length}</p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                <Car className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tín chỉ Carbon</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalCredits.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Leaf className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Số dư ví</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tín chỉ đã bán</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{credits.filter(c => c.status === 4).length}</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Xe của tôi</h2>
            {vehicles.length === 0 ? (
              <div className="text-center py-8">
                <Car className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa có xe nào được đăng ký</p>
                <Link
                  to="/ev-owner/vehicles"
                  className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Thêm xe đầu tiên
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                        <Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.year} - {vehicle.vin}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {vehicles.length > 3 && (
                  <Link to="/ev-owner/vehicles" className="block text-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mt-4">
                    Xem tất cả ({vehicles.length} xe)
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tín chỉ Carbon gần đây</h2>
            {credits.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa có tín chỉ nào</p>
                <Link
                  to="/ev-owner/trips"
                  className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Nhập hành trình
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {credits.slice(0, 3).map((credit) => (
                  <div key={credit.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <Leaf className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.availableUnits.toFixed(2)} tín chỉ</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {credit.status === 0 && 'Chờ xác minh'}
                          {credit.status === 1 && 'Đã phát hành'}
                          {credit.status === 2 && 'Đang niêm yết'}
                          {credit.status === 4 && 'Đã bán'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {credits.length > 3 && (
                  <Link to="/ev-owner/carbon-credits" className="block text-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mt-4">
                    Xem tất cả
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/ev-owner/vehicles"
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Car className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Quản lý xe</h3>
            <p className="text-emerald-100">Thêm và quản lý xe điện của bạn</p>
          </Link>

          <Link
            to="/ev-owner/trips"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Calendar className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Hành trình</h3>
            <p className="text-blue-100">Nhập và theo dõi các chuyến đi</p>
          </Link>

          <Link
            to="/ev-owner/wallet"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <Wallet className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ví</h3>
            <p className="text-green-100">Quản lý số dư và giao dịch</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

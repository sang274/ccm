import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout'; // Giữ nguyên layout của bạn
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Award, Gavel, History, ArrowRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';

export const BuyerDashboard = () => {
  const { user } = useAuth();
  
  // State lưu thống kê
  const [stats, setStats] = useState({
    auctions: 0,      // Số phiên đấu giá
    certificates: 0,  // Số chứng nhận sở hữu
    transactions: 0,  // Số giao dịch đã thực hiện
    creditsAvailable: 0 // Tín chỉ đang bán (nếu có API)
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm load dữ liệu thống kê
  async function loadStats() {
    setLoading(true);
    setError(null);
    try {
      // 1. Lấy số lượng chứng nhận (Certificates)
      const certsRes = await fetch(`${API_BASE}/certificates`);
      const certsData = certsRes.ok ? await certsRes.json() : [];
      const certsCount = Array.isArray(certsData.items) ? certsData.items.length : (Array.isArray(certsData) ? certsData.length : 0);

      // 2. Lấy lịch sử giao dịch (Transactions)
      const transactionsRes = await fetch(`${API_BASE}/transactions`);
      const transactionsData = transactionsRes.ok ? await transactionsRes.json() : [];
      const transactionsCount = Array.isArray(transactionsData.items) ? transactionsData.items.length : (Array.isArray(transactionsData) ? transactionsData.length : 0);

      // 3. Lấy số lượng phiên đấu giá (Auctions) - Mới thêm vào
      const auctionsRes = await fetch(`${API_BASE}/auctions`);
      const auctionsData = auctionsRes.ok ? await auctionsRes.json() : [];
      const auctionsCount = Array.isArray(auctionsData.items) ? auctionsData.items.length : (Array.isArray(auctionsData) ? auctionsData.length : 0);

      setStats({
        auctions: auctionsCount,
        certificates: certsCount,
        transactions: transactionsCount,
        creditsAvailable: 0 // Placeholder nếu muốn thêm
      });
    } catch (e) {
      console.error("Lỗi tải thống kê dashboard:", e);
      setError(`Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  // Cấu hình danh sách các thẻ điều hướng (Menu Cards)
  const menuItems = [
    {
      title: 'Sàn giao dịch',
      desc: 'Mua bán tín chỉ Carbon trực tiếp',
      icon: <ShoppingCart className="h-8 w-8 text-white" />,
      count: 'Mua ngay', // Hoặc hiển thị số lượng
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      link: '/market', // Link tới trang danh sách Market
      textColor: 'text-blue-100'
    },
    {
      title: 'Phiên đấu giá',
      desc: 'Tham gia đấu giá tín chỉ',
      icon: <Gavel className="h-8 w-8 text-white" />,
      count: `${stats.auctions} đang mở`,
      bg: 'bg-gradient-to-br from-orange-500 to-amber-600',
      link: '/market/auctions', // Link tới Auctions.jsx
      textColor: 'text-orange-100'
    },
    {
      title: 'Chứng nhận',
      desc: 'Quản lý chứng chỉ của bạn',
      icon: <Award className="h-8 w-8 text-white" />,
      count: `${stats.certificates} chứng nhận`,
      bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
      link: '/buyer/certificates', // Link tới Certificates.jsx
      textColor: 'text-purple-100'
    },
    {
      title: 'Lịch sử giao dịch',
      desc: 'Xem lại các lần mua hàng',
      icon: <History className="h-8 w-8 text-white" />,
      count: `${stats.transactions} giao dịch`,
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      link: '/buyer/my-purchases', // Link tới trang lịch sử
      textColor: 'text-green-100'
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tổng quan (Dashboard)</h1>
            <p className="text-slate-500 mt-1">
              Xin chào, <span className="font-semibold text-emerald-600">{user?.fullName || user?.email || 'Khách'}</span>!
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              Tài khoản Buyer
            </span>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Main Navigation Grid */}
        {loading ? (
          <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.bg}`}
              >
                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white`}>
                      {item.count}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className={`text-sm ${item.textColor} mb-4 line-clamp-1`}>
                    {item.desc}
                  </p>
                  
                  <div className="flex items-center text-white text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                    Truy cập <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                
                {/* Decorative circle background */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Activity Section (Optional) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
          <p className="text-slate-500">Chưa có hoạt động nào được ghi nhận gần đây.</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/market" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Khám phá thị trường tín chỉ &rarr;
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyerDashboard;
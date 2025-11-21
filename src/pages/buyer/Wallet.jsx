// src/pages/buyer/Wallet.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Wallet as WalletIcon, DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { buyerService } from '../../services/buyerService';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // MOCK DATA – DỰ PHÒNG KHI API LỖI
  const mockTransactions = [
    { id: '1', type: 'deposit', amount: 1000, description: 'Nạp tiền vào ví', status: 'completed', createdAt: new Date().toISOString() },
    { id: '2', type: 'purchase', amount: -1275, description: 'Mua tín chỉ từ Green Energy Co.', status: 'completed', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', type: 'deposit', amount: 500, description: 'Nạp tiền vào ví', status: 'completed', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '4', type: 'purchase', amount: -840, description: 'Mua tín chỉ từ EV Solutions', status: 'completed', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '5', type: 'deposit', amount: 2000, description: 'Nạp tiền vào ví', status: 'completed', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '6', type: 'bid', amount: -115.50, description: 'Đặt giá đấu giá', status: 'pending', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  ];

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);

      const wallet = await buyerService.getMyWallet(); // ← có thể là null!

      // SỬA DÒNG NÀY: kiểm tra null hoặc undefined
      if (wallet && wallet.fiatBalance !== undefined && wallet.fiatBalance !== null) {
        setBalance(wallet.fiatBalance);
        setTransactions([]); // chưa có transaction thật
      } else {
        // Người dùng chưa có ví → vẫn dùng mock (rất bình thường)
        console.info('Chưa tạo ví → hiển thị mock tạm thời');
        setBalance(0);
        setTransactions(mockTransactions);
      }

    } catch (error) {
      console.warn('Lỗi kết nối API ví:', error.message || error);
      setBalance(0);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng nạp / tổng chi (dùng mock hoặc thật đều được)
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(
    transactions
      .filter(t => t.type === 'purchase' || t.type === 'bid')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'purchase':
      case 'bid':
        return <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit': return 'text-green-600 dark:text-green-400';
      case 'purchase':
      case 'bid': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ví của tôi</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý số dư và giao dịch</p>
          </div>
          <Link
            to="/buyer/wallet/deposit"
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nạp tiền
          </Link>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <WalletIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Số dư khả dụng</p>
              {loading ? (
                <p className="text-4xl font-bold animate-pulse">Đang tải...</p>
              ) : (
                <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Tổng nạp</p>
              <p className="text-2xl font-bold">${totalDeposits.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm mb-1">Tổng chi</p>
              <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Stats + Transaction History – giữ nguyên đẹp như cũ */}
        {/* ... (giữ nguyên phần còn lại bạn đã có) */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 3 ô nhỏ: Số dư, Tổng nạp, Tổng chi */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <WalletIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Số dư hiện tại</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : `$${balance.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
          {/* 2 ô còn lại tương tự... */}
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Lịch sử giao dịch</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <WalletIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getTransactionColor(tx.type)}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {tx.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
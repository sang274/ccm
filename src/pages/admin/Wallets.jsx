import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Wallet, Search, Filter, TrendingUp, TrendingDown, DollarSign, Eye, Download } from 'lucide-react';
import { apiClient } from '../../services/api';

export const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/wallets');
      if (response.data.success) {
        setWallets(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
      // Mock data
      setWallets([
        {
          id: '1',
          userEmail: 'user1@example.com',
          userName: 'Nguyễn Văn A',
          fiatBalance: 5000.00,
          carbonCreditBalance: 150.5,
          totalDeposit: 10000.00,
          totalWithdraw: 5000.00,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletTransactions = async (walletId) => {
    try {
      const response = await apiClient.get(`/admin/wallets/${walletId}/transactions`);
      if (response.data.success) {
        setTransactions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      setTransactions([]);
    }
  };

  const handleViewWallet = (wallet) => {
    setSelectedWallet(wallet);
    fetchWalletTransactions(wallet.id);
    setShowModal(true);
  };

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = wallet.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalFiat = wallets.reduce((sum, w) => sum + (w.fiatBalance || 0), 0);
  const totalCredits = wallets.reduce((sum, w) => sum + (w.carbonCreditBalance || 0), 0);
  const totalDeposits = wallets.reduce((sum, w) => sum + (w.totalDeposit || 0), 0);
  const totalWithdraws = wallets.reduce((sum, w) => sum + (w.totalWithdraw || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý ví điện tử</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Theo dõi và quản lý tất cả ví người dùng</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="h-5 w-5" />
            Xuất báo cáo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng số dư Fiat</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalFiat.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng tín chỉ</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCredits.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng nạp tiền</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalDeposits.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng rút tiền</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalWithdraws.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo email hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
          </div>
        </div>

        {/* Wallets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số dư Fiat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tín chỉ Carbon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tổng nạp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tổng rút
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                  {filteredWallets.map((wallet) => (
                    <tr key={wallet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                            {wallet.userName?.charAt(0) || wallet.userEmail?.charAt(0) || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{wallet.userName || 'N/A'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{wallet.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">${wallet.fiatBalance.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{wallet.carbonCreditBalance.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">${wallet.totalDeposit.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600 dark:text-red-400 font-medium">${wallet.totalWithdraw.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewWallet(wallet)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredWallets.length === 0 && (
                <div className="text-center py-12">
                  <Wallet className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có ví</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Không tìm thấy ví nào phù hợp.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wallet Detail Modal */}
        {showModal && selectedWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chi tiết ví - {selectedWallet.userName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{selectedWallet.userEmail}</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Balance Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Số dư Fiat</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${selectedWallet.fiatBalance.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tín chỉ Carbon</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedWallet.carbonCreditBalance.toFixed(2)}</p>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lịch sử giao dịch</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {transactions.length > 0 ? (
                      transactions.map((tx, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                              {tx.type === 'deposit' ? (
                                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                          <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">Chưa có giao dịch nào</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

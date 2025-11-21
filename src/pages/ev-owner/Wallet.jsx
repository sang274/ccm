import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Wallet as WalletIcon, Leaf, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { evOwnerService } from '../../services/evOwnerService';

export default function EVOwnerWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const response = await evOwnerService.getWallet();
      setWallet(response.data || {
        balance: 150.75,
        totalEarned: 500,
        totalSold: 349.25,
        pendingCredits: 25
      });
    } catch (error) {
      console.error('Error loading wallet:', error);
      // Mock data
      setWallet({
        balance: 150.75,
        totalEarned: 500,
        totalSold: 349.25,
        pendingCredits: 25
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (amount > wallet.balance) {
      alert('Số dư không đủ');
      return;
    }

    if (!bankAccount) {
      alert('Vui lòng nhập số tài khoản ngân hàng');
      return;
    }

    try {
      setWithdrawing(true);
      await evOwnerService.withdrawFunds(amount, bankAccount);
      alert('Yêu cầu rút tiền thành công! Tiền sẽ được chuyển trong 1-3 ngày làm việc.');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setBankAccount('');
      loadWallet();
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Không thể rút tiền. Vui lòng thử lại sau.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ví Carbon</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý tín chỉ carbon và doanh thu</p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform shadow-lg font-semibold"
          >
            <Download className="h-5 w-5" />
            Rút tiền
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carbon Credits Balance */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white animate-fadeInUp animation-delay-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Leaf className="h-8 w-8" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Tín chỉ Carbon</p>
                <p className="text-4xl font-bold">{wallet.balance.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Tổng kiếm được</p>
                <p className="text-2xl font-bold">{wallet.totalEarned.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">Đã bán</p>
                <p className="text-2xl font-bold">{wallet.totalSold.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Fiat Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white animate-fadeInUp animation-delay-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Doanh thu (USD)</p>
                <p className="text-4xl font-bold">${(wallet.totalSold * 25).toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-blue-100 text-sm mb-1">Có thể rút</p>
                <p className="text-2xl font-bold">${(wallet.balance * 25).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Đang chờ</p>
                <p className="text-2xl font-bold">{wallet.pendingCredits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-300">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                <Leaf className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tín chỉ hiện có</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{wallet.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-400">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng kiếm được</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{wallet.totalEarned.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <ArrowUpRight className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã bán</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{wallet.totalSold.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-600">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <WalletIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đang chờ</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{wallet.pendingCredits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8 animate-fadeInScale">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rút tiền</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số tiền rút (USD)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Số dư khả dụng: ${(wallet.balance * 25).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số tài khoản ngân hàng
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Nhập số tài khoản"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {withdrawing ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

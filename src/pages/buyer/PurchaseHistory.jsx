import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { History, Calendar, Package, DollarSign, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { buyerService } from '../../services/buyerService';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_LABELS = {
  0: 'Chờ xử lý',
  1: 'Đã xác nhận',
  2: 'Đã hoàn thành',
  3: 'Đã hủy',
  'pending': 'Chờ xử lý',
  'confirmed': 'Đã xác nhận',
  'completed': 'Đã hoàn thành',
  'cancelled': 'Đã hủy'
};

const STATUS_COLORS = {
  0: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  1: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  2: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  3: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  'confirmed': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  'completed': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  'cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
};

const STATUS_ICONS = {
  0: Clock,
  1: CheckCircle,
  2: CheckCircle,
  3: XCircle,
  'pending': Clock,
  'confirmed': CheckCircle,
  'completed': CheckCircle,
  'cancelled': XCircle
};

export default function PurchaseHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadPurchaseHistory();
    }
  }, [user]);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      const response = await buyerService.getPurchaseHistory(user.id);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error loading purchase history:', error);
      // Mock data for demo
      setTransactions([
        {
          id: 'TXN001',
          creditId: 'CR001',
          buyerId: user?.id,
          sellerId: 'seller1',
          sellerName: 'Green Energy Co.',
          quantity: 50,
          pricePerUnit: 25.50,
          totalAmount: 1275,
          status: 2,
          paymentMethod: 'VNPay',
          createdAt: new Date().toISOString(),
          region: 'Hà Nội'
        },
        {
          id: 'TXN002',
          creditId: 'CR002',
          buyerId: user?.id,
          sellerId: 'seller2',
          sellerName: 'EV Solutions',
          quantity: 30,
          pricePerUnit: 28.00,
          totalAmount: 840,
          status: 2,
          paymentMethod: 'Banking',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          region: 'TP.HCM'
        },
        {
          id: 'TXN003',
          creditId: 'CR003',
          buyerId: user?.id,
          sellerId: 'seller3',
          sellerName: 'Carbon Trade Ltd.',
          quantity: 75,
          pricePerUnit: 26.00,
          totalAmount: 1950,
          status: 1,
          paymentMethod: 'Wallet',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          region: 'Đà Nẵng'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalCredits = transactions.reduce((sum, tx) => sum + tx.quantity, 0);
  const completedCount = transactions.filter(tx => tx.status === 2 || tx.status === 'completed').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch sử mua hàng</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Xem lại các giao dịch mua tín chỉ của bạn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-100">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <History className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng giao dịch</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-200">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng chi tiêu</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tín chỉ</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCredits} tấn</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-400">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Bạn chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fadeInUp animation-delay-500">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Mã GD
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Người bán
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Ngày mua
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((tx) => {
                    const StatusIcon = STATUS_ICONS[tx.status];
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{tx.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{tx.sellerName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{tx.region}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">{tx.quantity} tấn</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            ${tx.totalAmount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[tx.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {STATUS_LABELS[tx.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(tx)}
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">Chi tiết</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transaction Detail Modal */}
        {showModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-8 animate-fadeInScale">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chi tiết giao dịch</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Mã giao dịch:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Người bán:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.sellerName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Khu vực:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.region}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Số lượng:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.quantity} tấn CO2</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Giá/đơn vị:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${selectedTransaction.pricePerUnit}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${selectedTransaction.totalAmount}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Phương thức thanh toán:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[selectedTransaction.status]}`}>
                    {STATUS_LABELS[selectedTransaction.status]}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600 dark:text-gray-400">Ngày mua:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
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
}

import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DollarSign, Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Eye, Download } from 'lucide-react';
import { apiClient } from '../../services/api';

const STATUS_LABELS = {
  0: 'Chờ xử lý',
  1: 'Đã xác nhận',
  2: 'Đã hoàn thành',
  3: 'Đã hủy',
  4: 'Tranh chấp'
};

const STATUS_COLORS = {
  0: 'bg-yellow-100 text-yellow-800',
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-green-100 text-green-800',
  3: 'bg-red-100 text-red-800',
  4: 'bg-orange-100 text-orange-800'
};

const STATUS_ICONS = {
  0: Clock,
  1: CheckCircle,
  2: CheckCircle,
  3: XCircle,
  4: AlertTriangle
};

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/transactions');
      if (response.data.success) {
        setTransactions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Mock data for demo
      setTransactions([
        {
          id: '1',
          buyerEmail: 'buyer@example.com',
          sellerEmail: 'seller@example.com',
          amount: 1500.00,
          units: 50,
          status: 0,
          createdAt: new Date().toISOString(),
          type: 'purchase'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      await apiClient.put(`/admin/transactions/${transactionId}/status`, { status: newStatus });
      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.sellerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tx.status === parseInt(filterStatus);
    return matchesSearch && matchesStatus;
  });

  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const completedAmount = transactions.filter(tx => tx.status === 2).reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const pendingCount = transactions.filter(tx => tx.status === 0).length;
  const disputeCount = transactions.filter(tx => tx.status === 4).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý giao dịch</h1>
            <p className="text-gray-600 mt-1">Theo dõi và xử lý tất cả giao dịch</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="h-5 w-5" />
            Xuất báo cáo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">${completedAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tranh chấp</p>
                <p className="text-2xl font-bold text-gray-900">{disputeCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="0">Chờ xử lý</option>
                <option value="1">Đã xác nhận</option>
                <option value="2">Đã hoàn thành</option>
                <option value="3">Đã hủy</option>
                <option value="4">Tranh chấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người mua
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người bán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((tx) => {
                    const StatusIcon = STATUS_ICONS[tx.status];
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{tx.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.buyerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.sellerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.units} tín chỉ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[tx.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {STATUS_LABELS[tx.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setShowModal(true);
                            }}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không có giao dịch</h3>
                  <p className="mt-1 text-sm text-gray-500">Không tìm thấy giao dịch nào phù hợp.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {showModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch #{selectedTransaction.id}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Người mua</p>
                    <p className="font-medium">{selectedTransaction.buyerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Người bán</p>
                    <p className="font-medium">{selectedTransaction.sellerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số lượng</p>
                    <p className="font-medium">{selectedTransaction.units} tín chỉ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá trị</p>
                    <p className="font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[selectedTransaction.status]}`}>
                      {STATUS_LABELS[selectedTransaction.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày tạo</p>
                    <p className="font-medium">{new Date(selectedTransaction.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {selectedTransaction.status === 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-3">Thao tác</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusChange(selectedTransaction.id, 1)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedTransaction.id, 3)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {selectedTransaction.status === 4 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-3">Xử lý tranh chấp</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusChange(selectedTransaction.id, 2)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Hoàn thành
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedTransaction.id, 3)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Hủy giao dịch
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
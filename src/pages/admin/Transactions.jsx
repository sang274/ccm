// src/pages/admin/Transactions.jsx
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DollarSign, Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Eye, Download, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/api';

const STATUS_LABELS = {
  Pending: 'Chờ xử lý',
  Confirmed: 'Đã xác nhận',
  Completed: 'Đã hoàn thành',
  Cancelled: 'Đã hủy',
  Disputed: 'Tranh chấp'
};

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Disputed: 'bg-orange-100 text-orange-800'
};

const STATUS_ICONS = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Completed: CheckCircle,
  Cancelled: XCircle,
  Disputed: AlertTriangle
};

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTransactions = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/transactions', {
        params: { page: pageNum, pageSize }
      });

      const result = response.data; // API trả về PaginatedResult<TransactionDto>
      setTransactions(result.items || []);
      setTotalPages(result.totalPages || 1);
      setTotalResults(result.totalResults || 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Không thể tải danh sách giao dịch');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  // Confirm transaction
  const confirmTransaction = async (id) => {
    try {
      await apiClient.put(`/admin/transactions/${id}/confirm`);
      alert('Giao dịch đã được xác nhận');
      fetchTransactions(page);
    } catch (error) {
      alert('Xác nhận thất bại');
    }
  };

  // Cancel transaction
  const cancelTransaction = async (id) => {
    try {
      await apiClient.put(`/admin/transactions/${id}/cancel`);
      alert('Giao dịch đã bị hủy');
      fetchTransactions(page);
    } catch (error) {
      alert('Hủy giao dịch thất bại');
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      tx.id?.toString().includes(searchLower) ||
      tx.buyerEmail?.toLowerCase().includes(searchLower) ||
      tx.sellerEmail?.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Tính toán stats
  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const completedAmount = transactions.filter(tx => tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0);
  const pendingCount = transactions.filter(tx => tx.status === 'Pending').length;
  const disputeCount = transactions.filter(tx => tx.status === 'Disputed').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý giao dịch</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Theo dõi và xử lý tất cả giao dịch trên nền tảng</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchTransactions(page)}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="h-5 w-5" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng giá trị</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">${completedAmount.toFixed(2)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tranh chấp</p>
                <p className="text-2xl font-bold text-orange-600">{disputeCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, email người mua/bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="Completed">Đã hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
              <option value="Disputed">Tranh chấp</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải giao dịch...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Người mua</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Người bán</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Số lượng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Giá trị</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ngày tạo</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTransactions.map((tx) => {
                      const StatusIcon = STATUS_ICONS[tx.status];
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm font-medium">#{tx.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-sm">{tx.buyerEmail}</td>
                          <td className="px-6 py-4 text-sm">{tx.sellerEmail}</td>
                          <td className="px-6 py-4 text-sm">{tx.units} tín chỉ</td>
                          <td className="px-6 py-4 text-sm font-medium">${tx.amount?.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[tx.status]}`}>
                              <StatusIcon className="h-3 w-3" />
                              {STATUS_LABELS[tx.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedTransaction(tx);
                                setShowModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-800"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalResults)} của {totalResults}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchTransactions(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span className="px-3 py-1">Trang {page}/{totalPages}</span>
                    <button
                      onClick={() => fetchTransactions(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal chi tiết */}
        {showModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold">Chi tiết giao dịch</h2>
                <p className="text-sm text-gray-500">ID: {selectedTransaction.id}</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Người mua</p>
                    <p className="font-medium">{selectedTransaction.buyerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Người bán</p>
                    <p className="font-medium">{selectedTransaction.sellerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Số lượng</p>
                    <p className="font-medium">{selectedTransaction.units} tín chỉ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Giá trị</p>
                    <p className="font-medium text-emerald-600">${selectedTransaction.amount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedTransaction.status]}`}>
                      {(() => {
                        const StatusIcon = STATUS_ICONS[selectedTransaction.status];
                        return StatusIcon ? <StatusIcon className="h-4 w-4" /> : null;
                      })()}
                      {STATUS_LABELS[selectedTransaction.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Thời gian</p>
                    <p className="font-medium">{new Date(selectedTransaction.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {/* Hành động cho admin */}
                {(selectedTransaction.status === 'Pending' || selectedTransaction.status === 'Disputed') && (
                  <div className="pt-6 border-t dark:border-gray-700">
                    <p className="font-medium mb-4">Hành động của Admin</p>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTransaction.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => confirmTransaction(selectedTransaction.id)}
                            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                          >
                            Xác nhận giao dịch
                          </button>
                          <button
                            onClick={() => cancelTransaction(selectedTransaction.id)}
                            className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                          >
                            Hủy giao dịch
                          </button>
                        </>
                      )}
                      {selectedTransaction.status === 'Disputed' && (
                        <>
                          <button
                            onClick={() => confirmTransaction(selectedTransaction.id)}
                            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                          >
                            Giải quyết tranh chấp (Hoàn thành)
                          </button>
                          <button
                            onClick={() => cancelTransaction(selectedTransaction.id)}
                            className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                          >
                            Hủy giao dịch
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
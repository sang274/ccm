// src/pages/ev-owner/components/TransactionsTab.jsx
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, DollarSign, Package } from 'lucide-react';
import { evOwnerService } from '../../../services/evOwnerService';

export function TransactionsTab({ loadData: reloadParent }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await evOwnerService.getTransactions();
      // Backend trả về: { success: true, data: { items: [...] } }
      const items = res?.data?.data?.items || res?.data?.items || res?.data || [];
      setTransactions(items);
    } catch (error) {
      console.error('Lỗi tải giao dịch:', error);
      setTransactions([]);
      alert('Không thể tải danh sách giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleCancel = async (transactionId) => {
    if (!confirm('Bạn có chắc muốn HỦY giao dịch này?')) return;

    try {
      setProcessingId(transactionId);
      await evOwnerService.cancelTransaction(transactionId);
      alert('Đã hủy giao dịch thành công!');
      loadTransactions();
      reloadParent?.();
    } catch (error) {
      alert('Không thể hủy giao dịch');
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (transactionId) => {
    if (!confirm('Xác nhận HOÀN THÀNH giao dịch này?')) return;

    try {
      setProcessingId(transactionId);
      await evOwnerService.completeTransaction(transactionId);
      alert('Giao dịch đã hoàn thành! Tiền đã vào ví.');
      loadTransactions();
      reloadParent?.();
    } catch (error) {
      alert('Không thể hoàn thành giao dịch');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      Pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      Confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: Clock },
      Completed: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      Cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    const cfg = config[status] || config.Pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Đang tải giao dịch...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Giao dịch bán tín chỉ</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý các đơn hàng từ người mua</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl">
          <p className="text-sm text-gray-500">Tổng giao dịch</p>
          <p className="text-3xl font-bold text-emerald-600">{transactions.length}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <DollarSign className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">Chưa có giao dịch nào</p>
          <p className="text-sm text-gray-500">Khi có người mua tín chỉ của bạn, giao dịch sẽ hiện ở đây</p>
        </div>
      ) : (
        <div className="space-y-5">
          {transactions.map((tx) => (
            <div
              key={tx.Id || tx.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Giao dịch #{(tx.Id || tx.id)?.slice(0, 8).toUpperCase()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.CreatedAt || tx.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {getStatusBadge(tx.Status || tx.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-600">Số lượng</p>
                    <p className="font-bold text-lg">{Number(tx.Quantity || tx.quantity).toFixed(6)} tấn</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-bold text-lg text-emerald-600">
                      ${Number(tx.TotalAmount || tx.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">B</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Người mua</p>
                    <p className="font-medium">Ẩn danh</p>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              {(tx.Status === 'Pending' || tx.Status === 'Confirmed' ||
                tx.status === 'pending' || tx.status === 'confirmed') && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleComplete(tx.Id || tx.id)}
                      disabled={processingId === (tx.Id || tx.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Hoàn thành
                    </button>
                    <button
                      onClick={() => handleCancel(tx.Id || tx.id)}
                      disabled={processingId === (tx.Id || tx.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                      <XCircle className="h-5 w-5" />
                      Hủy giao dịch
                    </button>
                  </div>
                )}

              {tx.Status === 'Completed' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 rounded-lg p-4 text-center">
                  <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-800 dark:text-green-300">
                    Giao dịch đã hoàn thành • Tiền đã vào ví của bạn
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { evOwnerService } from '../../../services/evOwnerService';

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

export function TransactionsTab({ transactions, loadData }) {
  const handleCancel = async (transactionId) => {
    if (!confirm('Bạn có chắc muốn hủy giao dịch này?')) return;
    
    try {
      await evOwnerService.cancelTransaction(transactionId);
      alert('Đã hủy giao dịch');
      loadData();
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      alert('Không thể hủy giao dịch');
    }
  };

  const handleComplete = async (transactionId) => {
    if (!confirm('Xác nhận hoàn thành giao dịch?')) return;
    
    try {
      await evOwnerService.completeTransaction(transactionId);
      alert('Đã hoàn thành giao dịch');
      loadData();
    } catch (error) {
      console.error('Error completing transaction:', error);
      alert('Không thể hoàn thành giao dịch');
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-300">Theo dõi và quản lý các giao dịch bán tín chỉ</p>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Giao dịch #{tx.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[tx.status]}`}>
                  {STATUS_LABELS[tx.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Số lượng:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{tx.quantity} tấn</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                  <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">${tx.totalAmount}</span>
                </div>
              </div>

              {(tx.status === 0 || tx.status === 'pending') && (
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleComplete(tx.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Hoàn thành
                  </button>
                  <button
                    onClick={() => handleCancel(tx.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

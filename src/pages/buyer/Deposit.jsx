//src/pages/buyer/Deposit.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { DollarSign, CreditCard, Smartphone, Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { buyerService } from '../../services/buyerService';

const QUICK_AMOUNTS = [10, 30, 50, 100, 500, 1000];

const PAYMENT_METHODS = [
  {
    id: 'vnpay',
    name: 'VNPay',
    icon: CreditCard,
    description: 'Thanh toán qua VNPay',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'momo',
    name: 'MoMo',
    icon: Smartphone,
    description: 'Ví điện tử MoMo',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'banking',
    name: 'Ngân hàng',
    icon: Building2,
    description: 'Chuyển khoản ngân hàng',
    color: 'from-green-500 to-green-600'
  }
];

export default function Deposit() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('vnpay');
  const [processing, setProcessing] = useState(false);

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  // src/pages/buyer/Deposit.jsx

  // src/pages/buyer/Deposit.jsx → trong handleDeposit()

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount < 10) {
      alert('Số tiền nạp tối thiểu là $10');
      return;
    }

    try {
      setProcessing(true);

      const result = await buyerService.depositWithVNPay(depositAmount);

      // console.log('VNPAY URL:', result.paymentUrl);
      // DelayNode.delay(10000, () => { })
      // result giờ là { paymentUrl, transactionId }
      if (result?.paymentUrl) {
        console.log('Redirecting to VNPay:', result.paymentUrl); // để check
        window.location.href = result.paymentUrl;
      }
    } catch (error) {
      console.error('Lỗi nạp tiền:', error);
      alert(error.message || 'Không thể tạo link thanh toán. Vui lòng thử lại!');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/buyer/wallet')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors animate-fadeInUp"
        >
          <ArrowLeft className="h-5 w-5" />
          Quay lại ví
        </button>

        {/* Header */}
        <div className="text-center animate-fadeInUp animation-delay-100">
          <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-4">
            <DollarSign className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nạp tiền vào ví</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Chọn số tiền và phương thức thanh toán</p>
        </div>

        {/* Quick Amount Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeInUp animation-delay-200">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Chọn nhanh số tiền</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 transform ${amount === value.toString()
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 text-gray-900 dark:text-white'
                  }`}
              >
                <div className="text-2xl font-bold">${value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeInUp animation-delay-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hoặc nhập số tiền khác</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="number"
              min="10"
              max="10000000000000000000"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền (tối thiểu $10)"
              className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Số tiền nạp: $10 - $10.000.000.000.000.000.000
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeInUp animation-delay-400">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Chọn phương thức thanh toán</h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 hover:scale-102 transform ${selectedMethod === method.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`bg-gradient-to-br ${method.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 dark:text-white">{method.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary and Confirm */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeInUp animation-delay-500">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tóm tắt</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Số tiền nạp:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${amount || '0.00'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Phí giao dịch:</span>
              <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Phương thức:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Tổng cộng:</span>
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                ${amount || '0.00'}
              </span>
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) < 10 || processing}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg font-semibold shadow-lg"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <DollarSign className="h-6 w-6" />
                Xác nhận nạp tiền
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Bằng việc tiếp tục, bạn đồng ý với điều khoản và chính sách của chúng tôi
          </p>
        </div>
      </div>
    </Layout>
  );
}

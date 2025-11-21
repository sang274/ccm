import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { ShoppingCart, MapPin, Package, DollarSign, Calendar, User, ArrowLeft } from 'lucide-react';
import { buyerService } from '../../services/buyerService';
import { useAuth } from '../../contexts/AuthContext';

export default function CreditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  useEffect(() => {
    loadCredit();
  }, [id]);

  const loadCredit = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      setCredit({
        id: id,
        sellerName: 'Green Energy Co.',
        sellerId: 'seller123',
        quantity: 100,
        pricePerUnit: 25.50,
        totalPrice: 2550,
        region: 'Hà Nội',
        status: 'available',
        description: 'Tín chỉ carbon chất lượng cao từ xe điện Tesla Model 3. Đã được xác minh bởi cơ quan CVA độc lập. Phù hợp cho doanh nghiệp muốn bù đắp lượng khí thải CO2.',
        createdAt: new Date().toISOString(),
        verificationStatus: 'verified',
        standard: 'VCS (Verified Carbon Standard)'
      });
    } catch (error) {
      console.error('Error loading credit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để mua tín chỉ');
      navigate('/login');
      return;
    }

    if (quantity <= 0 || quantity > credit.quantity) {
      alert('Số lượng không hợp lệ');
      return;
    }

    try {
      setPurchasing(true);
      const response = await buyerService.buyCredit({
        creditId: credit.id,
        quantity: quantity,
        paymentMethod: paymentMethod
      });

      if (response.success) {
        alert('Mua tín chỉ thành công!');
        navigate('/buyer/certificates');
      } else {
        alert(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error purchasing credit:', error);
      alert('Không thể mua tín chỉ. Vui lòng thử lại sau.');
    } finally {
      setPurchasing(false);
    }
  };

  const totalPrice = credit ? (credit.pricePerUnit * quantity).toFixed(2) : 0;

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

  if (!credit) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">Không tìm thấy tín chỉ</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/market')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors animate-fadeInUp"
        >
          <ArrowLeft className="h-5 w-5" />
          Quay lại sàn giao dịch
        </button>

        {/* Credit Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fadeInUp animation-delay-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {credit.sellerName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {credit.region}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(credit.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 font-semibold rounded-full">
              ✓ Đã xác minh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Số lượng có sẵn</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{credit.quantity} tấn</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Giá mỗi tấn CO2</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${credit.pricePerUnit}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <User className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Tiêu chuẩn</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{credit.standard}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mô tả</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {credit.description}
            </p>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fadeInUp animation-delay-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mua tín chỉ</h2>
          
          <div className="space-y-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số lượng (tấn CO2)
              </label>
              <input
                type="number"
                min="1"
                max={credit.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tối đa: {credit.quantity} tấn
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phương thức thanh toán
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="wallet">Ví điện tử</option>
                <option value="banking">Chuyển khoản ngân hàng</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
              </select>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Đơn giá:</span>
                <span className="text-gray-900 dark:text-white font-semibold">${credit.pricePerUnit} / tấn</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Số lượng:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{quantity} tấn</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Tổng cộng:</span>
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              {purchasing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  Xác nhận mua
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

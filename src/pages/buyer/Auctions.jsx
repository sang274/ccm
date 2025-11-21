import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Gavel, Clock, DollarSign, Package, TrendingUp, Users, Calendar } from 'lucide-react';
import { buyerService } from '../../services/buyerService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState({});
  const [bidding, setBidding] = useState({});

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auctions`);
      if (!res.ok) {
        throw new Error('Không tìm thấy phiên đấu giá.');
      }
      const data = await res.json();
      const auctionList = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      setAuctions(auctionList);
      
      // Mock data if no auctions
      if (auctionList.length === 0) {
        setAuctions([
          {
            id: '1',
            title: 'Tín chỉ Carbon - Xe điện Tesla',
            description: 'Phiên đấu giá tín chỉ carbon chất lượng cao từ xe điện Tesla Model 3. Đã được xác minh bởi CVA.',
            quantity: 100,
            startingBid: 2000,
            currentBid: 2500,
            minBidIncrement: 50,
            startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            bidCount: 5,
            region: 'Hà Nội'
          },
          {
            id: '2',
            title: 'Tín chỉ Carbon - VinFast VF8',
            description: 'Đấu giá tín chỉ carbon từ xe điện VinFast VF8. Tiêu chuẩn VCS.',
            quantity: 75,
            startingBid: 1500,
            currentBid: 1800,
            minBidIncrement: 50,
            startAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
            endAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            bidCount: 3,
            region: 'TP.HCM'
          }
        ]);
      }
    } catch (e) {
      setError(e.message);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (auctionId) => {
    const amount = bidAmount[auctionId];
    if (!amount || amount <= 0) {
      alert('Vui lòng nhập số tiền đặt giá');
      return;
    }

    try {
      setBidding({ ...bidding, [auctionId]: true });
      await buyerService.placeBid({
        auctionId: auctionId,
        bidAmount: Number(amount)
      });
      alert('Đặt giá thành công!');
      loadAuctions();
      setBidAmount({ ...bidAmount, [auctionId]: '' });
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Không thể đặt giá. Vui lòng thử lại.');
    } finally {
      setBidding({ ...bidding, [auctionId]: false });
    }
  };

  const getTimeRemaining = (endAt) => {
    const now = new Date();
    const end = new Date(endAt);
    const diff = end - now;
    
    if (diff <= 0) return 'Đã kết thúc';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} ngày ${hours % 24} giờ`;
    }
    return `${hours} giờ ${minutes} phút`;
  };

  const activeAuctions = auctions.filter(a => a.status === 'active').length;
  const totalBids = auctions.reduce((sum, a) => sum + (a.bidCount || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Phiên đấu giá</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Tham gia đấu giá tín chỉ carbon</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-100">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <Gavel className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phiên đang mở</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeAuctions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng lượt đặt giá</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalBids}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-300">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Người tham gia</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{auctions.length * 3}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Auctions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Không có phiên đấu giá nào hiện tại</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {auctions.map((auction, index) => (
              <div
                key={auction.id}
                className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp animation-delay-${(index + 4) * 100}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {auction.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {auction.region}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs font-semibold rounded-full">
                    Đang mở
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {auction.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <Package className="h-4 w-4" />
                      Số lượng
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{auction.quantity} tấn</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <DollarSign className="h-4 w-4" />
                      Giá hiện tại
                    </div>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${auction.currentBid}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <Clock className="h-4 w-4" />
                      Thời gian còn lại
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{getTimeRemaining(auction.endAt)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <Users className="h-4 w-4" />
                      Lượt đặt giá
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{auction.bidCount || 0}</p>
                  </div>
                </div>

                {/* Bid Form */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`Tối thiểu $${auction.currentBid + (auction.minBidIncrement || 50)}`}
                      value={bidAmount[auction.id] || ''}
                      onChange={(e) => setBidAmount({ ...bidAmount, [auction.id]: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                    <button
                      onClick={() => handlePlaceBid(auction.id)}
                      disabled={bidding[auction.id]}
                      className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {bidding[auction.id] ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Gavel className="h-5 w-5" />
                          Đặt giá
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Bước giá tối thiểu: ${auction.minBidIncrement || 50}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
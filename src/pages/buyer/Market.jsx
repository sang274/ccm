import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Search, Filter, ShoppingCart, MapPin, DollarSign, Package } from 'lucide-react';
import { buyerService } from '../../services/buyerService';

export default function Market() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    minQuantity: '',
    maxQuantity: '',
    minPrice: '',
    maxPrice: '',
    region: '',
    status: 'available'
  });

  useEffect(() => {
    searchCredits();
  }, []);

  const searchCredits = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.minQuantity) params.minQuantity = Number(searchParams.minQuantity);
      if (searchParams.maxQuantity) params.maxQuantity = Number(searchParams.maxQuantity);
      if (searchParams.minPrice) params.minPrice = Number(searchParams.minPrice);
      if (searchParams.maxPrice) params.maxPrice = Number(searchParams.maxPrice);
      if (searchParams.region) params.region = searchParams.region;
      if (searchParams.status) params.status = searchParams.status;

      const response = await buyerService.searchCredits(params);
      setCredits(response.data || []);
    } catch (error) {
      console.error('Error searching credits:', error);
      // Mock data for demo
      setCredits([
        {
          id: '1',
          sellerName: 'Green Energy Co.',
          quantity: 100,
          pricePerUnit: 25.50,
          totalPrice: 2550,
          region: 'Hà Nội',
          status: 'available',
          description: 'Tín chỉ carbon từ xe điện Tesla Model 3',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          sellerName: 'EV Solutions',
          quantity: 50,
          pricePerUnit: 28.00,
          totalPrice: 1400,
          region: 'TP.HCM',
          status: 'available',
          description: 'Tín chỉ carbon từ xe điện VinFast VF8',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchCredits();
  };

  const handleReset = () => {
    setSearchParams({
      minQuantity: '',
      maxQuantity: '',
      minPrice: '',
      maxPrice: '',
      region: '',
      status: 'available'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sàn giao dịch tín chỉ</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Tìm kiếm và mua tín chỉ carbon</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 animate-fadeInUp animation-delay-100">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Quantity Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Package className="inline h-4 w-4 mr-1" />
                Số lượng (tấn CO2)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Từ"
                  value={searchParams.minQuantity}
                  onChange={(e) => setSearchParams({...searchParams, minQuantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={searchParams.maxQuantity}
                  onChange={(e) => setSearchParams({...searchParams, maxQuantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Giá ($)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Từ"
                  value={searchParams.minPrice}
                  onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Khu vực
              </label>
              <select
                value={searchParams.region}
                onChange={(e) => setSearchParams({...searchParams, region: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="">Tất cả khu vực</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform shadow-md hover:shadow-lg"
              >
                <Search className="h-5 w-5" />
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-md"
              >
                <Filter className="h-5 w-5" />
                Đặt lại
              </button>
            </div>
          </form>
        </div>

        {/* Credits List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : credits.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Không tìm thấy tín chỉ nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credits.map((credit, index) => (
              <div
                key={credit.id}
                className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp animation-delay-${(index + 2) * 100}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {credit.sellerName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {credit.region}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold rounded-full">
                    Có sẵn
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {credit.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Số lượng:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{credit.quantity} tấn CO2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Giá/đơn vị:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${credit.pricePerUnit}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Tổng giá:</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${credit.totalPrice}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/buyer/credit/${credit.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Mua ngay
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Calculator, Package, TrendingUp, CheckCircle, Plus, DollarSign, Gavel, X } from 'lucide-react';
import { evOwnerService } from '../../services/evOwnerService';
import { TransactionsTab } from './components/TransactionsTab';

export default function CarbonCredits() {
  const [activeTab, setActiveTab] = useState('calculate');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Calculate tab state
  const [carbonCredits, setCarbonCredits] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [totalUnits, setTotalUnits] = useState('');
  const [metadata, setMetadata] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Listings tab state
  const [listings, setListings] = useState([]);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [listingFormData, setListingFormData] = useState({
    quantity: '',
    pricePerUnit: '',
    listingType: 'fixed',
    description: '',
    auctionEndTime: '',
    minBidIncrement: '',
    startingBid: ''
  });
  const [creatingListing, setCreatingListing] = useState(false);
  
  // Transactions tab state
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [walletData, creditsData, listingsData, transactionsData] = await Promise.all([
        evOwnerService.getWallet(),
        evOwnerService.getCarbonCredits(),
        evOwnerService.getListings(),
        evOwnerService.getTransactions()
      ]);
      
      setWallet(walletData.data || { balance: 150.75, totalEarned: 500, totalSold: 349.25, pendingCredits: 25 });
      setCarbonCredits(creditsData.data || []);
      setListings(listingsData.data || []);
      setTransactions(transactionsData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Mock data
      setWallet({ balance: 150.75, totalEarned: 500, totalSold: 349.25, pendingCredits: 25 });
      setCarbonCredits([]);
      setListings([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCredit = async () => {
    if (!totalUnits || totalUnits <= 0) {
      alert('Vui lòng nhập số lượng tín chỉ hợp lệ');
      return;
    }

    try {
      setCreating(true);
      await evOwnerService.createCarbonCredit({
        totalUnits: Number(totalUnits),
        metadata: metadata || undefined
      });
      alert('Tạo tín chỉ carbon thành công!');
      setShowCreateModal(false);
      setTotalUnits('');
      setMetadata('');
      loadData();
    } catch (error) {
      console.error('Error creating carbon credit:', error);
      alert('Không thể tạo tín chỉ. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateListing = async () => {
    try {
      setCreatingListing(true);
      const data = {
        quantity: Number(listingFormData.quantity),
        listingType: listingFormData.listingType,
        description: listingFormData.description
      };

      if (listingFormData.listingType === 'fixed') {
        data.pricePerUnit = Number(listingFormData.pricePerUnit);
      } else {
        data.startingBid = Number(listingFormData.startingBid);
        data.minBidIncrement = Number(listingFormData.minBidIncrement);
        data.auctionEndTime = listingFormData.auctionEndTime;
      }

      await evOwnerService.createListing(data);
      alert('Tạo niêm yết thành công!');
      setShowCreateListing(false);
      setListingFormData({
        quantity: '',
        pricePerUnit: '',
        listingType: 'fixed',
        description: '',
        auctionEndTime: '',
        minBidIncrement: '',
        startingBid: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Không thể tạo niêm yết');
    } finally {
      setCreatingListing(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="animate-fadeInUp">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tín chỉ Carbon</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý và giao dịch tín chỉ carbon</p>
          </div>

        {/* Wallet Summary */}
        {wallet && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white animate-fadeInUp animation-delay-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Số dư hiện tại</p>
                <p className="text-3xl font-bold">{wallet.balance.toFixed(2)}</p>
                <p className="text-emerald-100 text-xs mt-1">tấn CO₂</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">Tổng kiếm được</p>
                <p className="text-2xl font-bold">{wallet.totalEarned.toFixed(2)}</p>
                <p className="text-emerald-100 text-xs mt-1">tấn CO₂</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">Đã bán</p>
                <p className="text-2xl font-bold">{wallet.totalSold.toFixed(2)}</p>
                <p className="text-emerald-100 text-xs mt-1">tấn CO₂</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">Đang chờ</p>
                <p className="text-2xl font-bold">{wallet.pendingCredits}</p>
                <p className="text-emerald-100 text-xs mt-1">tín chỉ</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fadeInUp animation-delay-200">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('calculate')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'calculate'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Calculator className="inline h-5 w-5 mr-2" />
              Tính toán CO₂
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'listings'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Package className="inline h-5 w-5 mr-2" />
              Niêm yết ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="inline h-5 w-5 mr-2" />
              Giao dịch ({transactions.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Calculate Tab */}
            {activeTab === 'calculate' && (
              <CarbonCreditsTab
                carbonCredits={carbonCredits}
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
                totalUnits={totalUnits}
                setTotalUnits={setTotalUnits}
                metadata={metadata}
                setMetadata={setMetadata}
                creating={creating}
                handleCreateCredit={handleCreateCredit}
              />
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <ListingsTabContent
                listings={listings}
                showCreateListing={showCreateListing}
                setShowCreateListing={setShowCreateListing}
                listingFormData={listingFormData}
                setListingFormData={setListingFormData}
                creatingListing={creatingListing}
                handleCreateListing={handleCreateListing}
              />
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <TransactionsTab
                transactions={transactions}
                loadData={loadData}
              />
            )}
          </div>
        </div>
      </div>
      </Layout>

      {/* Modals - Rendered outside Layout */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8 animate-fadeInScale">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tạo tín chỉ Carbon</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số lượng (tấn CO₂) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                  placeholder="VD: 0.01"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder="Thông tin bổ sung..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateCredit}
                disabled={creating}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {creating ? 'Đang tạo...' : 'Tạo tín chỉ'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-fadeInScale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tạo niêm yết mới</h3>
              <button onClick={() => setShowCreateListing(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loại niêm yết</label>
                <select
                  value={listingFormData.listingType}
                  onChange={(e) => setListingFormData({...listingFormData, listingType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="fixed">Giá cố định</option>
                  <option value="auction">Đấu giá</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số lượng (tấn CO₂)</label>
                <input
                  type="number"
                  value={listingFormData.quantity}
                  onChange={(e) => setListingFormData({...listingFormData, quantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {listingFormData.listingType === 'fixed' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Giá mỗi tấn ($)</label>
                  <input
                    type="number"
                    value={listingFormData.pricePerUnit}
                    onChange={(e) => setListingFormData({...listingFormData, pricePerUnit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Giá khởi điểm ($)</label>
                    <input
                      type="number"
                      value={listingFormData.startingBid}
                      onChange={(e) => setListingFormData({...listingFormData, startingBid: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bước giá ($)</label>
                    <input
                      type="number"
                      value={listingFormData.minBidIncrement}
                      onChange={(e) => setListingFormData({...listingFormData, minBidIncrement: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thời gian kết thúc</label>
                    <input
                      type="datetime-local"
                      value={listingFormData.auctionEndTime}
                      onChange={(e) => setListingFormData({...listingFormData, auctionEndTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả</label>
                <textarea
                  value={listingFormData.description}
                  onChange={(e) => setListingFormData({...listingFormData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateListing}
                disabled={creatingListing}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-semibold"
              >
                {creatingListing ? 'Đang tạo...' : 'Tạo niêm yết'}
              </button>
              <button
                onClick={() => setShowCreateListing(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Calculate Tab Component
function CalculateTab({ distance, setDistance, vehicleType, setVehicleType, calculation, setCalculation, calculating, setCalculating }) {
  const handleCalculate = async () => {
    if (!distance || distance <= 0) {
      alert('Vui lòng nhập quãng đường hợp lệ');
      return;
    }

    try {
      setCalculating(true);
      const response = await evOwnerService.calculateEmissions({
        distance: Number(distance),
        vehicleType: vehicleType
      });
      setCalculation(response.data || {
        distance: Number(distance),
        co2Reduced: (Number(distance) * 0.12).toFixed(2),
        creditsEarned: (Number(distance) * 0.12 / 1000).toFixed(4)
      });
    } catch (error) {
      console.error('Error calculating:', error);
      // Mock calculation
      setCalculation({
        distance: Number(distance),
        co2Reduced: (Number(distance) * 0.12).toFixed(2),
        creditsEarned: (Number(distance) * 0.12 / 1000).toFixed(4)
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          💡 Tính toán lượng CO₂ giảm được từ việc sử dụng xe điện thay vì xe xăng
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quãng đường (km)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Nhập quãng đường"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Loại xe
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={calculating}
        className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 font-semibold"
      >
        {calculating ? 'Đang tính toán...' : 'Tính toán CO₂'}
      </button>

      {calculation && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            Kết quả tính toán
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quãng đường</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculation.distance} km</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CO₂ giảm được</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{calculation.co2Reduced} kg</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tín chỉ kiếm được</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{calculation.creditsEarned}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Carbon Credits Tab Component
function CarbonCreditsTab({ carbonCredits, showCreateModal, setShowCreateModal, totalUnits, setTotalUnits, metadata, setMetadata, creating, handleCreateCredit }) {
  const STATUS_LABELS = {
    0: 'Chờ xác minh',
    1: 'Đã phát hành',
    2: 'Đang niêm yết',
    3: 'Đã khóa',
    4: 'Đã bán'
  };

  const STATUS_COLORS = {
    0: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    1: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    3: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400',
    4: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">Quản lý tín chỉ carbon của bạn</p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all"
        >
          <Calculator className="h-5 w-5" />
          Thêm tín chỉ
        </button>
      </div>

      {carbonCredits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa có tín chỉ carbon nào</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all"
          >
            <Calculator className="h-5 w-5" />
            Tạo tín chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carbonCredits.map((credit) => (
            <div key={credit.reductionId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <Package className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[credit.status]}`}>
                  {STATUS_LABELS[credit.status]}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tổng số:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{credit.totalUnits} tấn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Còn lại:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{credit.availableUnits} tấn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngày phát hành:</span>
                  <span className="text-gray-900 dark:text-white">{new Date(credit.issuedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// Listings Tab Component
function ListingsTabContent({ listings, showCreateListing, setShowCreateListing, listingFormData, setListingFormData, creatingListing, handleCreateListing }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">Quản lý các niêm yết tín chỉ carbon của bạn</p>
        <button
          onClick={() => setShowCreateListing(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all"
        >
          <Plus className="h-5 w-5" />
          Tạo niêm yết
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Chưa có niêm yết nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {listing.listingType === 'fixed' ? (
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Gavel className="h-5 w-5 text-orange-600" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {listing.listingType === 'fixed' ? 'Giá cố định' : 'Đấu giá'}
                  </span>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                  Đang hoạt động
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{listing.description}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Số lượng:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{listing.quantity} tấn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Giá:</span>
                  <span className="font-semibold text-emerald-600">${listing.pricePerUnit || listing.startingBid}/tấn</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

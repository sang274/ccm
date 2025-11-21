import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Package, Plus, Edit, Trash2, Eye, DollarSign, Gavel } from 'lucide-react';
import { evOwnerService } from '../../services/evOwnerService';

export default function EVOwnerListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    pricePerUnit: '',
    listingType: 'fixed',
    description: '',
    auctionEndTime: '',
    minBidIncrement: '',
    startingBid: ''
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await evOwnerService.getListings();
      setListings(response.data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      // Mock data
      setListings([
        {
          id: '1',
          quantity: 100,
          pricePerUnit: 25.50,
          totalPrice: 2550,
          listingType: 'fixed',
          status: 'active',
          description: 'Tín chỉ carbon chất lượng cao',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    try {
      const data = {
        quantity: Number(formData.quantity),
        listingType: formData.listingType,
        description: formData.description
      };

      if (formData.listingType === 'fixed') {
        data.pricePerUnit = Number(formData.pricePerUnit);
      } else {
        data.startingBid = Number(formData.startingBid);
        data.minBidIncrement = Number(formData.minBidIncrement);
        data.auctionEndTime = formData.auctionEndTime;
      }

      await evOwnerService.createListing(data);
      alert('Tạo niêm yết thành công!');
      setShowCreateModal(false);
      setFormData({
        quantity: '',
        pricePerUnit: '',
        listingType: 'fixed',
        description: '',
        auctionEndTime: '',
        minBidIncrement: '',
        startingBid: ''
      });
      loadListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Không thể tạo niêm yết. Vui lòng thử lại.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Niêm yết của tôi</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý các niêm yết tín chỉ carbon</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform shadow-lg font-semibold"
          >
            <Plus className="h-5 w-5" />
            Tạo niêm yết
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Chưa có niêm yết nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {listing.listingType === 'fixed' ? (
                      <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Gavel className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {listing.listingType === 'fixed' ? 'Giá cố định' : 'Đấu giá'}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold rounded-full">
                    Đang hoạt động
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{listing.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Số lượng:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{listing.quantity} tấn</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Giá:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ${listing.pricePerUnit || listing.startingBid}/tấn
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Tổng:</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${listing.totalPrice || (listing.quantity * listing.startingBid)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm">
                    <Eye className="h-4 w-4" />
                    Xem
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm">
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-8 animate-fadeInScale max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tạo niêm yết mới</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loại niêm yết
                  </label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => setFormData({...formData, listingType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="fixed">Giá cố định</option>
                    <option value="auction">Đấu giá</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số lượng (tấn CO2)
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {formData.listingType === 'fixed' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giá mỗi tấn ($)
                    </label>
                    <input
                      type="number"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Giá khởi điểm ($)
                      </label>
                      <input
                        type="number"
                        value={formData.startingBid}
                        onChange={(e) => setFormData({...formData, startingBid: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bước giá ($)
                      </label>
                      <input
                        type="number"
                        value={formData.minBidIncrement}
                        onChange={(e) => setFormData({...formData, minBidIncrement: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Thời gian kết thúc
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.auctionEndTime}
                        onChange={(e) => setFormData({...formData, auctionEndTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateListing}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold"
                >
                  Tạo niêm yết
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
      </div>
    </Layout>
  );
}

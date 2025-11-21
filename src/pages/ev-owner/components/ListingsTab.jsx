import { useState } from 'react';
import { Plus, DollarSign, Gavel, Eye, X } from 'lucide-react';
import { evOwnerService } from '../../../services/evOwnerService';

export function ListingsTab({ listings, showCreateListing, setShowCreateListing, loadData }) {
  const [formData, setFormData] = useState({
    quantity: '',
    pricePerUnit: '',
    listingType: 'fixed',
    description: '',
    auctionEndTime: '',
    minBidIncrement: '',
    startingBid: ''
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    try {
      setCreating(true);
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
      setShowCreateListing(false);
      setFormData({
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
      setCreating(false);
    }
  };

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

      {/* Create Modal */}
      {showCreateListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tạo niêm yết mới</h3>
              <button onClick={() => setShowCreateListing(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loại niêm yết</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({...formData, listingType: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="fixed">Giá cố định</option>
                  <option value="auction">Đấu giá</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số lượng (tấn CO₂)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {formData.listingType === 'fixed' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Giá mỗi tấn ($)</label>
                  <input
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Giá khởi điểm ($)</label>
                    <input
                      type="number"
                      value={formData.startingBid}
                      onChange={(e) => setFormData({...formData, startingBid: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bước giá ($)</label>
                    <input
                      type="number"
                      value={formData.minBidIncrement}
                      onChange={(e) => setFormData({...formData, minBidIncrement: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Thời gian kết thúc</label>
                    <input
                      type="datetime-local"
                      value={formData.auctionEndTime}
                      onChange={(e) => setFormData({...formData, auctionEndTime: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {creating ? 'Đang tạo...' : 'Tạo niêm yết'}
              </button>
              <button
                onClick={() => setShowCreateListing(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

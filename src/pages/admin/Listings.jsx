// src/pages/admin/Listings.jsx
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Package, Search, Filter, CheckCircle, Clock, Eye, XCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

const STATUS_LABELS = {
  0: 'Chờ duyệt',
  1: 'Đang niêm yết',
  2: 'Đã bán',
  3: 'Đã hủy'
};

const STATUS_COLORS = {
  0: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  1: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  3: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const STATUS_ICONS = {
  0: <Clock className="h-4 w-4" />,
  1: <CheckCircle className="h-4 w-4" />,
  2: <Package className="h-4 w-4" />,
  3: <XCircle className="h-4 w-4" />
};

export const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/listing'); // API thật

      if (response.data?.success && Array.isArray(response.data.data)) {
        setListings(response.data.data);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi tải niêm yết:', error);
      // Mock data khi API lỗi (để không crash)
      setListings([
        {
          id: 'LST001',
          seller: { fullName: 'Trần Thị B', email: 'tranb@example.com' },
          units: 250,
          pricePerUnit: 28.5,
          totalValue: 7125.0,
          status: 0,
          createdAt: new Date().toISOString(),
          description: 'Tín chỉ carbon từ dự án năng lượng mặt trời tại Bình Thuận'
        },
        {
          id: 'LST002',
          seller: { fullName: 'Lê Văn C', email: 'levanc@example.com' },
          units: 500,
          pricePerUnit: 32.0,
          totalValue: 16000.0,
          status: 1,
          createdAt: '2025-03-15T10:30:00Z',
          description: 'Tín chỉ từ rừng trồng tại Lâm Đồng'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await apiClient.put(`/listing/${listingId}/status`, { status: newStatus });
      await fetchListings(); // Reload danh sách
      setShowModal(false);
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      alert('Cập nhật thất bại! Vui lòng thử lại.');
    }
  };

  const filteredListings = listings.filter(listing => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      listing.id?.toLowerCase().includes(search) ||
      listing.seller?.email?.toLowerCase().includes(search) ||
      listing.seller?.fullName?.toLowerCase().includes(search);

    const matchesStatus = filterStatus === 'all' || listing.status === parseInt(filterStatus);
    return matchesSearch && matchesStatus;
  });

  // Thống kê
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 1).length;
  const pendingListings = listings.filter(l => l.status === 0).length;
  const totalValue = listings
    .filter(l => l.status === 1)
    .reduce((sum, l) => sum + (l.totalValue || l.units * l.pricePerUnit), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý niêm yết</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Theo dõi và duyệt các niêm yết tín chỉ carbon</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng niêm yết</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Đang niêm yết</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Giá trị đang niêm yết</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo ID, email, tên người bán..."
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
              <option value="0">Chờ duyệt</option>
              <option value="1">Đang niêm yết</option>
              <option value="2">Đã bán</option>
              <option value="3">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải niêm yết...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Người bán</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Số lượng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Giá/đơn vị</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tổng giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ngày tạo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">#{listing.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{listing.seller?.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{listing.seller?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{listing.units} tín chỉ</td>
                      <td className="px-6 py-4 text-sm">${Number(listing.pricePerUnit).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ${Number(listing.totalValue || listing.units * listing.pricePerUnit).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${STATUS_COLORS[listing.status]}`}>
                          {STATUS_ICONS[listing.status]}
                          {STATUS_LABELS[listing.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredListings.length === 0 && (
                <div className="text-center py-16">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">Không tìm thấy niêm yết nào</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal chi tiết + duyệt */}
        {showModal && selectedListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-2xl font-bold">Niêm yết #{selectedListing.id}</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Người bán</p>
                    <p className="font-semibold">{selectedListing.seller?.fullName}</p>
                    <p className="text-sm text-gray-500">{selectedListing.seller?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedListing.status]}`}>
                      {STATUS_ICONS[selectedListing.status]}
                      {STATUS_LABELS[selectedListing.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số lượng</p>
                    <p className="text-xl font-bold">{selectedListing.units} tín chỉ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giá mỗi tín chỉ</p>
                    <p className="text-xl font-bold">${Number(selectedListing.pricePerUnit).toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Tổng giá trị</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ${Number(selectedListing.totalValue || selectedListing.units * selectedListing.pricePerUnit).toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedListing.description && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Mô tả dự án</p>
                    <p className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">{selectedListing.description}</p>
                  </div>
                )}

                {/* Nút duyệt (chỉ hiện khi đang chờ duyệt) */}
                {selectedListing.status === 0 && (
                  <div className="pt-6 border-t dark:border-gray-700">
                    <p className="font-medium mb-4">Duyệt niêm yết này?</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleStatusChange(selectedListing.id, 1)}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                      >
                        Phê duyệt & Đưa lên sàn
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedListing.id, 3)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t dark:border-gray-700 text-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
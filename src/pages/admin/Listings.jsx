import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Package, Search, Filter, CheckCircle, XCircle, Clock, Eye, Edit } from 'lucide-react';
import { apiClient } from '../../services/api';

const STATUS_LABELS = {
  0: 'Chờ duyệt',
  1: 'Đang niêm yết',
  2: 'Đã bán',
  3: 'Đã hủy'
};

const STATUS_COLORS = {
  0: 'bg-yellow-100 text-yellow-800',
  1: 'bg-green-100 text-green-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-red-100 text-red-800'
};

export const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/listings');
      if (response.data.success) {
        setListings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Mock data
      setListings([
        {
          id: '1',
          sellerEmail: 'seller@example.com',
          sellerName: 'Nguyễn Văn A',
          units: 100,
          pricePerUnit: 30.00,
          totalValue: 3000.00,
          status: 0,
          createdAt: new Date().toISOString(),
          description: 'Tín chỉ carbon từ xe điện Tesla Model 3'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await apiClient.put(`/admin/listings/${listingId}/status`, { status: newStatus });
      fetchListings();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.sellerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || listing.status === parseInt(filterStatus);
    return matchesSearch && matchesStatus;
  });

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 1).length;
  const pendingListings = listings.filter(l => l.status === 0).length;
  const totalValue = listings.filter(l => l.status === 1).reduce((sum, l) => sum + (l.totalValue || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý niêm yết</h1>
            <p className="text-gray-600 mt-1">Quản lý tất cả niêm yết tín chỉ carbon</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng niêm yết</p>
                <p className="text-2xl font-bold text-gray-900">{totalListings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đang niêm yết</p>
                <p className="text-2xl font-bold text-gray-900">{activeListings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{pendingListings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giá trị niêm yết</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="0">Chờ duyệt</option>
                <option value="1">Đang niêm yết</option>
                <option value="2">Đã bán</option>
                <option value="3">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người bán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá/đơn vị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng giá trị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{listing.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{listing.sellerName}</div>
                        <div className="text-sm text-gray-500">{listing.sellerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {listing.units} tín chỉ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${listing.pricePerUnit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${listing.totalValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[listing.status]}`}>
                          {STATUS_LABELS[listing.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không có niêm yết</h3>
                  <p className="mt-1 text-sm text-gray-500">Không tìm thấy niêm yết nào phù hợp.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Listing Detail Modal */}
        {showModal && selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết niêm yết #{selectedListing.id}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Người bán</p>
                    <p className="font-medium">{selectedListing.sellerName}</p>
                    <p className="text-sm text-gray-500">{selectedListing.sellerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[selectedListing.status]}`}>
                      {STATUS_LABELS[selectedListing.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số lượng</p>
                    <p className="font-medium">{selectedListing.units} tín chỉ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá/đơn vị</p>
                    <p className="font-medium">${selectedListing.pricePerUnit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng giá trị</p>
                    <p className="font-medium text-lg">${selectedListing.totalValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày tạo</p>
                    <p className="font-medium">{new Date(selectedListing.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {selectedListing.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mô tả</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedListing.description}</p>
                  </div>
                )}

                {selectedListing.status === 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-3">Thao tác duyệt</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusChange(selectedListing.id, 1)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedListing.id, 3)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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

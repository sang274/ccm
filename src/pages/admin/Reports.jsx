// src/pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Users, Package, BarChart3 } from 'lucide-react';
import { apiClient } from '../../services/api';

export const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/reports/summary', {
        params: dateRange
      });
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Mock data
      setReportData({
        totalTransactions: 150,
        totalRevenue: 45000.00,
        totalUsers: 320,
        totalCreditsTraded: 1500,
        averageTransactionValue: 300.00,
        topSellers: [
          { name: 'Nguyễn Văn A', email: 'seller1@example.com', revenue: 5000 },
          { name: 'Trần Thị B', email: 'seller2@example.com', revenue: 4500 }
        ],
        topBuyers: [
          { name: 'Lê Văn C', email: 'buyer1@example.com', spent: 6000 },
          { name: 'Phạm Thị D', email: 'buyer2@example.com', spent: 5500 }
        ],
        monthlyData: [
          { month: 'Tháng 1', transactions: 45, revenue: 13500 },
          { month: 'Tháng 2', transactions: 52, revenue: 15600 },
          { month: 'Tháng 3', transactions: 53, revenue: 15900 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      const response = await apiClient.get(`/admin/reports/export`, {
        params: { ...dateRange, format },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${dateRange.startDate}_${dateRange.endDate}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Xuất báo cáo thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo tổng hợp</h1>
            <p className="text-gray-600 mt-1">Thống kê và phân tích giao dịch tín chỉ carbon</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExportReport('pdf')}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              PDF
            </button>
            <button
              onClick={() => handleExportReport('xlsx')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Excel
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải báo cáo...</p>
          </div>
        ) : reportData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Tổng giao dịch</p>
                    <p className="text-3xl font-bold mt-2">{reportData.totalTransactions}</p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Tổng doanh thu</p>
                    <p className="text-3xl font-bold mt-2">${reportData.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Người dùng</p>
                    <p className="text-3xl font-bold mt-2">{reportData.totalUsers}</p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Tín chỉ đã giao dịch</p>
                    <p className="text-3xl font-bold mt-2">{reportData.totalCreditsTraded}</p>
                  </div>
                  <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                    <Package className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Sellers */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                  Top người bán
                </h2>
                <div className="space-y-3">
                  {reportData.topSellers.map((seller, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{seller.name}</p>
                          <p className="text-sm text-gray-500">{seller.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">${seller.revenue.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Doanh thu</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Buyers */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Top người mua
                </h2>
                <div className="space-y-3">
                  {reportData.topBuyers.map((buyer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{buyer.name}</p>
                          <p className="text-sm text-gray-500">{buyer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">${buyer.spent.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Chi tiêu</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                Hiệu suất theo tháng
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tháng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doanh thu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trung bình/GD
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.monthlyData.map((month, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {month.transactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${month.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(month.revenue / month.transactions).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow p-6 border border-emerald-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-600" />
                Tóm tắt báo cáo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Giá trị TB/Giao dịch</p>
                  <p className="text-2xl font-bold text-gray-900">${reportData.averageTransactionValue.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Tổng tín chỉ</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalCreditsTraded}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

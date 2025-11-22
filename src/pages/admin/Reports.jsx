// src/pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  FileText, Download, Calendar, TrendingUp,
  DollarSign, Users, Package, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react';
import { apiClient } from '../../services/api';

export const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });
  const [reportData, setReportData] = useState(null);

  const fetchReports = async () => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      alert('Vui lòng chọn khoảng thời gian');
      return;
    }

    setLoading(true);

    const basePayload = {
      FromDate: dateRange.fromDate,
      ToDate: dateRange.toDate,
    };

    try {
      const [transRes, revRes, userRes] = await Promise.all([
        apiClient.post('/admin/reports/transaction', { ...basePayload, ReportType: "TransactionReport" }),
        apiClient.post('/admin/reports/revenue', { ...basePayload, ReportType: "RevenueReport" }),
        apiClient.post('/admin/reports/user', { ...basePayload, ReportType: "UserReport" }),
      ]);

      // Dữ liệu nằm trong .payload
      const t = transRes.data.payload;
      const r = revRes.data.payload;
      const u = userRes.data.payload;

      const combined = {
        totalTransactions: t?.TotalTransactions || 0,
        totalRevenue: r?.TotalRevenue || 0,
        totalUsers: u?.TotalUsers || 0,
        totalCreditsTraded: t?.TotalVolume || 0,
        averageTransactionValue: r?.AverageTransactionValue || 0,
        totalCashFlow: r?.TotalCashFlow || 0,
        totalCarbonBalance: r?.TotalCarbonBalance || 0,
        completedTransactions: t?.CompletedTransactions || 0,
        pendingTransactions: t?.PendingTransactions || 0,

        // Backend chưa có top sellers/buyers → tạm ẩn hoặc để rỗng
        topSellers: [],
        topBuyers: [],

        // Monthly data (nếu có RevenueByMonth thì dùng, không thì rỗng)
        monthlyData: (r?.RevenueByMonth || []).map((m, i) => ({
          month: m.Month || `Tháng ${i + 1}`,
          transactions: m.TransactionCount || 0,
          revenue: m.Revenue || 0,
        })),
      };

      setReportData(combined);

    } catch (error) {
      console.error('Lỗi tải báo cáo:', error.response?.data || error);
      alert('Không thể tải báo cáo. Vui lòng thử lại.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const handleExportReport = async () => {
    try {
      const response = await apiClient.post('/admin/reports/transaction', {
        FromDate: dateRange.fromDate,
        ToDate: dateRange.toDate,
        ReportType: "TransactionReport"
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BaoCao_GiaoDich_${dateRange.fromDate}_den_${dateRange.toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Xuất báo cáo thất bại');
    }
  };

  return (
    <Layout>
      <div className="space-y-8 p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Báo cáo & Thống kê</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Tổng hợp hoạt động nền tảng tín chỉ carbon</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Tải lại
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition"
            >
              <Download className="h-5 w-5" />
              Xuất PDF
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-7 w-7 text-emerald-600" />
              <span className="text-lg font-semibold">Khoảng thời gian báo cáo</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={dateRange.fromDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={dateRange.toDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">Đang tổng hợp dữ liệu báo cáo...</p>
          </div>
        )}

        {/* No Data */}
        {!loading && !reportData && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Không có dữ liệu báo cáo</p>
            <p className="text-yellow-700 dark:text-yellow-300 mt-2">Thử chọn khoảng thời gian khác</p>
          </div>
        )}

        {/* Report Content */}
        {!loading && reportData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Tổng giao dịch</p>
                    <p className="text-4xl font-bold mt-2">{reportData.totalTransactions.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-12 w-12 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Doanh thu</p>
                    <p className="text-4xl font-bold mt-2">${reportData.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-12 w-12 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Tổng người dùng</p>
                    <p className="text-4xl font-bold mt-2">{reportData.totalUsers}</p>
                  </div>
                  <Users className="h-12 w-12 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Tín chỉ giao dịch</p>
                    <p className="text-4xl font-bold mt-2">{reportData.totalCreditsTraded.toLocaleString()}</p>
                  </div>
                  <Package className="h-12 w-12 opacity-80" />
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">Dòng tiền</p>
                <p className="text-3xl font-bold text-green-600">${reportData.totalCashFlow.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">Tín chỉ tồn</p>
                <p className="text-3xl font-bold text-blue-600">{reportData.totalCarbonBalance.toFixed(4)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">Giá trị TB/GD</p>
                <p className="text-3xl font-bold text-purple-600">${reportData.averageTransactionValue.toFixed(2)}</p>
              </div>
            </div>

            {/* Monthly Chart Placeholder */}
            {reportData.monthlyData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                  Doanh thu theo tháng
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4">Tháng</th>
                        <th className="px-6 py-4">Giao dịch</th>
                        <th className="px-6 py-4">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.monthlyData.map((m, i) => (
                        <tr key={i} className="border-t dark:border-gray-700">
                          <td className="px-6 py-4 font-medium">{m.month}</td>
                          <td className="px-6 py-4">{m.transactions}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">${m.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State khi chưa có giao dịch */}
            {reportData.totalTransactions === 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-10 text-center">
                <FileText className="h-20 w-20 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Chưa có giao dịch nào</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  Nền tảng đang hoạt động tốt. Khi có giao dịch đầu tiên, báo cáo sẽ tự động cập nhật.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
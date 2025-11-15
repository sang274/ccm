// src/pages/cva/Reports.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { useTheme } from '../../contexts/ThemeContext'; // THÊM DÒNG NÀY
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export const Reports = () => {
    const { theme } = useTheme(); // LẤY THEME
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        status: ''
    });

    useEffect(() => {
        fetchReports();
    }, [filters]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.from) params.append('from', filters.from);
            if (filters.to) params.append('to', filters.to);
            if (filters.status) params.append('status', filters.status);

            const res = await apiClient.get(`/cva/reports?${params.toString()}`);
            setReports(res.data.data || []);
        } catch (err) {
            console.error('Lỗi tải báo cáo:', err);
            alert('Lỗi tải dữ liệu: ' + (err.response?.data?.message || err.message));
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async (id) => {
        try {
            const blob = await apiClient.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BaoCao_${id.substring(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Lỗi tải PDF:', err);
            alert('Không thể tải PDF. Vui lòng thử lại.');
        }
    };

    // === LOADING STATE ===
    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải báo cáo...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6 p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        Báo cáo xác minh
                    </h1>
                </div>

                {/* FILTERS */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Từ ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={filters.from}
                                onChange={e => setFilters({ ...filters, from: e.target.value })}
                                className={`
                  w-full px-3 py-2 text-sm rounded-lg border
                  bg-white dark:bg-gray-700
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  transition-colors
                `}
                            />
                        </div>

                        {/* Đến ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={filters.to}
                                onChange={e => setFilters({ ...filters, to: e.target.value })}
                                className={`
                  w-full px-3 py-2 text-sm rounded-lg border
                  bg-white dark:bg-gray-700
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  transition-colors
                `}
                            />
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Trạng thái
                            </label>
                            <select
                                value={filters.status}
                                onChange={e => setFilters({ ...filters, status: e.target.value })}
                                className={`
                  w-full px-3 py-2 text-sm rounded-lg border
                  bg-white dark:bg-gray-700
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  transition-colors
                `}
                            >
                                <option value="">Tất cả</option>
                                <option value="0">Chưa xử lý</option>
                                <option value="1">Đã duyệt</option>
                                <option value="2">Từ chối</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
                    {reports.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400">Không có báo cáo nào phù hợp</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                    <tr>
                                        {[
                                            'Chủ sở hữu',
                                            'CO₂ giảm',
                                            'Tín chỉ',
                                            'Trạng thái',
                                            'Ngày nộp',
                                            'Hành động'
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {reports.map(r => (
                                        <tr
                                            key={r.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {/* Chủ sở hữu */}
                                            <td className="px-6 py-4 text-sm">
                                                <div className="text-gray-900 dark:text-white font-medium">
                                                    {r.user?.fullName || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {r.user?.email}
                                                </div>
                                            </td>

                                            {/* CO2 giảm */}
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                {Number(r.reducedCO2Kg).toLocaleString()} kg
                                            </td>

                                            {/* Tín chỉ */}
                                            <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                {r.creditsEquivalent}
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full transition-colors
                            ${r.status === 'Submitted'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            : r.status === 'Approved'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}
                                                >
                                                    {r.status === 'Submitted' ? 'Chưa xử lý' :
                                                        r.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                                                </span>
                                            </td>

                                            {/* Ngày nộp */}
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                            </td>

                                            {/* Hành động */}
                                            <td className="px-6 py-4 text-sm space-x-3">
                                                <Link
                                                    to={`/cva/report/${r.id}`}
                                                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors"
                                                >
                                                    Xem
                                                </Link>
                                                {r.status !== 'Submitted' && (
                                                    <button
                                                        onClick={() => downloadPdf(r.id)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        PDF
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
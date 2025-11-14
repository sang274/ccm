// src/pages/cva/Reports.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export const Reports = () => {
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

    // SỬA HÀM DOWNLOAD PDF DÙNG apiClient
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

    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải báo cáo...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6 p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="h-8 w-8 text-emerald-600" />
                        Báo cáo xác minh
                    </h1>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                value={filters.from}
                                onChange={e => setFilters({ ...filters, from: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input
                                type="date"
                                value={filters.to}
                                onChange={e => setFilters({ ...filters, to: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                value={filters.status}
                                onChange={e => setFilters({ ...filters, status: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {reports.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Không có báo cáo nào phù hợp</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chủ sở hữu</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CO₂ giảm</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tín chỉ</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày nộp</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reports.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {r.user?.fullName || 'N/A'}<br />
                                                <span className="text-xs text-gray-500">{r.user?.email}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {Number(r.reducedCO2Kg).toLocaleString()} kg
                                            </td>
                                            <td className="px-6 py-4 text-sm text-emerald-600 font-semibold">
                                                {r.creditsEquivalent}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${r.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                    r.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {r.status === 'Submitted' ? 'Chưa xử lý' :
                                                        r.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-sm space-x-2">
                                                <Link
                                                    to={`/cva/report/${r.id}`}
                                                    className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                >
                                                    Xem
                                                </Link>
                                                {r.status !== 'Submitted' && (
                                                    <button
                                                        onClick={() => downloadPdf(r.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
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
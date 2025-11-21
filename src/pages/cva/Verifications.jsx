// src/pages/cva/Verifications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { useTheme } from '../../contexts/ThemeContext'; // THÊM DÒNG NÀY
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export const Verifications = () => {
    const { theme } = useTheme(); // LẤY THEME HIỆN TẠI
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await apiClient.get('/cva/pending');
                setRequests(res.data || []);
            } catch (err) {
                console.error('Lỗi tải yêu cầu:', err);
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Loading state (cũng hỗ trợ dark mode)
    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải yêu cầu...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Yêu cầu xác minh
                </h1>

                {/* Bảng */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                        {/* Header */}
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {[
                                    'Chủ sở hữu',
                                    'CO₂ giảm (kg)',
                                    'Tín chỉ tương đương',
                                    'Ngày nộp',
                                    'Hành động',
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.length > 0 ? (
                                requests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {/* Chủ sở hữu */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {req.user?.email || 'N/A'}
                                        </td>

                                        {/* CO2 giảm */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {Number(req.reducedCO2Kg).toLocaleString()} kg
                                        </td>

                                        {/* Tín chỉ */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {req.creditsEquivalent}
                                        </td>

                                        {/* Ngày nộp */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                                        </td>

                                        {/* Hành động */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                to={`/cva/verification/${req.id}`}
                                                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Xem
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-12 text-gray-500 dark:text-gray-400"
                                    >
                                        Không có yêu cầu nào đang chờ xác minh
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};
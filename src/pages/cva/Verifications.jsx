// src/pages/cva/Verifications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export const Verifications = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await apiClient.get('/emission-reductions/pending');
                setRequests(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) return <Layout><div className="p-8 text-center">Đang tải...</div></Layout>;

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Yêu cầu xác minh</h1>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ sở hữu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂ giảm (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tín chỉ tương đương</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{req.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {req.userEmail}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {req.reducedCO2Kg.toLocaleString()} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {req.creditsEquivalent}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link
                                            to={`/cva/verification/${req.id}`}
                                            className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Xem
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Không có yêu cầu nào đang chờ xác minh
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
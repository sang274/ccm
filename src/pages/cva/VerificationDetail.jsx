// src/pages/cva/VerificationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export const VerificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await apiClient.get(`/EmissionReduction/${id}/details`);
                setRequest(res.data);
            } catch (err) {
                console.error('Lỗi tải chi tiết:', err);
                setRequest(null);
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id]);

    const handleAction = async (status) => {
        setActionLoading(true);
        try {
            await apiClient.post(`/cva/verify/${id}`, {
                status,
                comment,
            });
            alert(status === 1 ? 'Đã duyệt và cấp tín chỉ!' : 'Đã từ chối yêu cầu');
            navigate('/cva/verifications');
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải chi tiết...</p>
                </div>
            </Layout>
        );
    }

    if (!request) {
        return (
            <Layout>
                <div className="p-8 text-center text-red-600">Không tìm thấy yêu cầu</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Chi tiết yêu cầu #{id.slice(0, 8)}</h1>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Thông tin chủ sở hữu</h2>
                        <p className="text-gray-600">Email: {request.user?.email || 'N/A'}</p>
                        <p className="text-gray-600">Tên: {request.user?.fullName || 'N/A'}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Dữ liệu phát thải</h2>
                        <p className="text-gray-600">CO₂ giảm: <strong>{Number(request.reducedCO2Kg).toLocaleString()} kg</strong></p>
                        <p className="text-gray-600">Tín chỉ tương đương: <strong>{request.creditsEquivalent}</strong></p>
                        <p className="text-gray-600">Phương pháp tính: {request.calculationMethod || 'Không có'}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Hành động</h2>
                        <textarea
                            placeholder="Ghi chú (tùy chọn)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border rounded-lg mt-2"
                            rows="3"
                        />
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => handleAction(1)}
                                disabled={actionLoading}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                <CheckCircle className="h-5 w-5" />
                                Duyệt & Cấp tín chỉ
                            </button>
                            <button
                                onClick={() => handleAction(2)}
                                disabled={actionLoading}
                                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                <XCircle className="h-5 w-5" />
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
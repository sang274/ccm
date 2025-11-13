// src/pages/cva/VerificationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import {
    CheckCircle, XCircle, ArrowLeft,
    User, Calendar, Car, Zap
} from 'lucide-react';

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
                <div className="p-8 text-center text-red-600">
                    <XCircle className="h-12 w-12 mx-auto mb-3" />
                    <p>Không tìm thấy yêu cầu</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* HEADER */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chi tiết yêu cầu #{id.substring(0, 8).toUpperCase()}
                    </h1>
                </div>

                {/* CARD */}
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">

                    {/* CHỦ SỞ HỮU */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <User className="h-6 w-6 text-emerald-600" />
                            Chủ sở hữu
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">{request.user?.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-600">{request.user?.email || 'N/A'}</p>
                        </div>
                    </div>

                    {/* DỮ LIỆU PHÁT THẢI */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-800">
                            Dữ liệu phát thải
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-emerald-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-600">CO₂ giảm</p>
                                <p className="text-2xl font-bold text-emerald-700">
                                    {Number(request.reducedCO2Kg).toLocaleString()} kg
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-600">Tín chỉ</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {request.creditsEquivalent}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Phương pháp</p>
                                <p className="font-medium">{request.calculationMethod || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    {/* CHUYẾN ĐI */}
                    {request.trip && (
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-purple-600" />
                                Chuyến đi
                            </h2>
                            <div className="bg-purple-50 p-4 rounded-lg space-y-2 text-sm">
                                <p><strong>Thời gian:</strong> {new Date(request.trip.startTime).toLocaleString('vi-VN')} → {new Date(request.trip.endTime).toLocaleString('vi-VN')}</p>
                                <p><strong>Khoảng cách:</strong> {request.trip.distanceKm} km</p>
                                <p><strong>Năng lượng:</strong> <Zap className="inline h-4 w-4 text-yellow-500" /> {request.trip.energyUsedKWh} kWh</p>
                            </div>
                        </div>
                    )}

                    {/* XE ĐIỆN */}
                    {request.vehicle && (
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Car className="h-6 w-6 text-indigo-600" />
                                Xe điện
                            </h2>
                            <div className="bg-indigo-50 p-4 rounded-lg space-y-2 text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <p><strong>Hãng xe:</strong> {request.vehicle.make} {request.vehicle.model}</p>
                                    <p><strong>Năm sản xuất:</strong> {request.vehicle.year}</p>
                                    <p><strong>VIN:</strong> <span className="font-mono text-xs">{request.vehicle.vin}</span></p>
                                    <p><strong>Dung lượng pin:</strong> <span className="font-bold text-indigo-700">{request.vehicle.batteryCapacityKWh} kWh</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GHI CHÚ & HÀNH ĐỘNG */}
                    <div className="space-y-4 pt-6 border-t">
                        <h2 className="text-xl font-bold text-gray-800">Ghi chú & Hành động</h2>
                        <textarea
                            placeholder="Ghi chú cho người dùng (tùy chọn)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            rows="3"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleAction(1)}
                                disabled={actionLoading}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                            >
                                <CheckCircle className="h-5 w-5" />
                                Duyệt & Cấp tín chỉ
                            </button>
                            <button
                                onClick={() => handleAction(2)}
                                disabled={actionLoading}
                                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                            >
                                <XCircle className="h-5 w-5" />
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};
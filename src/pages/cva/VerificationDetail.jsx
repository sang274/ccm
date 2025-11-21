// src/pages/cva/VerificationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext'; // THÊM DÒNG NÀY
import {
    CheckCircle, XCircle, ArrowLeft,
    User, Calendar, Car, Zap
} from 'lucide-react';

export const VerificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme(); // LẤY THEME
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
            await apiClient.post(`/cva/verify/${id}`, { status, comment });
            alert(status === 1 ? 'Đã duyệt và cấp tín chỉ!' : 'Đã từ chối yêu cầu');
            navigate('/cva/verifications');
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    // === LOADING STATE ===
    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải chi tiết...</p>
                </div>
            </Layout>
        );
    }

    // === ERROR STATE ===
    if (!request) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-3 text-red-600 dark:text-red-400" />
                    <p className="text-red-600 dark:text-red-400">Không tìm thấy yêu cầu</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* HEADER */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Chi tiết yêu cầu #{id.substring(0, 8).toUpperCase()}
                    </h1>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8 transition-colors">

                    {/* CHỦ SỞ HỮU */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            Chủ sở hữu
                        </h2>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {request.user?.fullName || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.user?.email || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* DỮ LIỆU PHÁT THẢI */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            Dữ liệu phát thải
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* CO2 giảm */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center border border-emerald-200 dark:border-emerald-800">
                                <p className="text-sm text-gray-600 dark:text-gray-400">CO₂ giảm</p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                    {Number(request.reducedCO2Kg).toLocaleString()} kg
                                </p>
                            </div>

                            {/* Tín chỉ */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tín chỉ</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                    {request.creditsEquivalent}
                                </p>
                            </div>

                            {/* Phương pháp */}
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Phương pháp</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {request.calculationMethod || 'Không có'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CHUYẾN ĐI */}
                    {request.trip && (
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Chuyến đi
                            </h2>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-2 text-sm border border-purple-200 dark:border-purple-800">
                                <p>
                                    <strong className="text-gray-700 dark:text-gray-300">Thời gian:</strong>{' '}
                                    {new Date(request.trip.startTime).toLocaleString('vi-VN')} →{' '}
                                    {new Date(request.trip.endTime).toLocaleString('vi-VN')}
                                </p>
                                <p>
                                    <strong className="text-gray-700 dark:text-gray-300">Khoảng cách:</strong>{' '}
                                    {request.trip.distanceKm} km
                                </p>
                                <p>
                                    <strong className="text-gray-700 dark:text-gray-300">Năng lượng:</strong>{' '}
                                    <Zap className="inline h-4 w-4 text-yellow-500 dark:text-yellow-400" />{' '}
                                    {request.trip.energyUsedKWh} kWh
                                </p>
                            </div>
                        </div>
                    )}

                    {/* XE ĐIỆN */}
                    {request.vehicle && (
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Car className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                Xe điện
                            </h2>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg space-y-2 text-sm border border-indigo-200 dark:border-indigo-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">Hãng xe:</strong>{' '}
                                        {request.vehicle.make} {request.vehicle.model}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">Năm sản xuất:</strong>{' '}
                                        {request.vehicle.year}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">VIN:</strong>{' '}
                                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                            {request.vehicle.vin}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">Dung lượng pin:</strong>{' '}
                                        <span className="font-bold text-indigo-700 dark:text-indigo-400">
                                            {request.vehicle.batteryCapacityKWh} kWh
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GHI CHÚ & HÀNH ĐỘNG */}
                    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            Ghi chú & Hành động
                        </h2>
                        <textarea
                            placeholder="Ghi chú cho người dùng (tùy chọn)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className={`
                w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                border-gray-300 dark:border-gray-600
                transition-colors
              `}
                            rows="3"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleAction(1)}
                                disabled={actionLoading}
                                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                  bg-green-600 hover:bg-green-700 disabled:opacity-50
                  text-white
                  transition-all duration-200
                  ${actionLoading ? 'animate-pulse' : ''}
                `}
                            >
                                <CheckCircle className="h-5 w-5" />
                                Duyệt & Cấp tín chỉ
                            </button>
                            <button
                                onClick={() => handleAction(2)}
                                disabled={actionLoading}
                                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                  bg-red-600 hover:bg-red-700 disabled:opacity-50
                  text-white
                  transition-all duration-200
                  ${actionLoading ? 'animate-pulse' : ''}
                `}
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
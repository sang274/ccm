// src/pages/cva/ReportDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { useTheme } from '../../contexts/ThemeContext'; // THÊM DÒNG NÀY
import { ArrowLeft, Download, User, Calendar, CheckCircle, XCircle, Clock, Car } from 'lucide-react';

export const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme(); // LẤY THEME
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await apiClient.get(`/EmissionReduction/${id}/details`);
                setReport(res.data);
            } catch (err) {
                console.error(err);
                alert('Lỗi tải chi tiết');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const downloadPdf = async () => {
        try {
            const blob = await apiClient.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BaoCao_${id.substring(0, 8)}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Lỗi tải PDF');
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
    if (!report) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-3 text-red-600 dark:text-red-400" />
                    <p className="text-red-600 dark:text-red-400">Không tìm thấy báo cáo</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Quay lại
                    </button>
                    {report.status !== 'Submitted' && (
                        <button
                            onClick={downloadPdf}
                            className={`
                bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg 
                flex items-center gap-2 font-medium transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                        >
                            <Download className="h-5 w-5" />
                            Tải PDF
                        </button>
                    )}
                </div>

                {/* MAIN CARD */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Báo cáo #{id.substring(0, 8).toUpperCase()}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Ngày nộp: {new Date(report.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* CHỦ SỞ HỮU */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Chủ sở hữu
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {report.user.fullName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {report.user.email}
                                </p>
                            </div>
                        </div>

                        {/* TRẠNG THÁI */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                {report.status === 'Submitted' ? (
                                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                ) : report.status === 'Approved' ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                                Trạng thái
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p
                                    className={`font-bold text-lg transition-colors
                    ${report.status === 'Submitted'
                                            ? 'text-yellow-600 dark:text-yellow-400'
                                            : report.status === 'Approved'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                        }`}
                                >
                                    {report.status === 'Submitted' ? 'Chưa xử lý' :
                                        report.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Người duyệt:{' '}
                                    <span className={report.cvaReviewer ? 'font-medium text-gray-900 dark:text-white' : 'italic text-gray-500 dark:text-gray-500'}>
                                        {report.cvaReviewer?.fullName || 'Chưa có người duyệt đơn'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* DỮ LIỆU PHÁT THẢI */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Dữ liệu phát thải
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">CO₂ giảm</span>
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                        {Number(report.reducedCO2Kg).toLocaleString()} kg
                                    </span>
                                </div>
                                <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Tín chỉ</span>
                                    <span className="font-bold text-blue-700 dark:text-blue-400">
                                        {report.creditsEquivalent}
                                    </span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Phương pháp</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {report.calculationMethod || 'Không có'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CHUYẾN ĐI */}
                        {report.trip && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    Thông tin chuyến đi
                                </h3>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-2 text-sm border border-purple-200 dark:border-purple-800">
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">Thời gian:</strong>{' '}
                                        {new Date(report.trip.startTime).toLocaleString('vi-VN')} →{' '}
                                        {new Date(report.trip.endTime).toLocaleString('vi-VN')}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">Khoảng cách:</strong>{' '}
                                        {report.trip.distanceKm} km
                                    </p>
                                    <p>
                                        <strong className="text-gray-700 dark:text-gray-300">Năng lượng:</strong>{' '}
                                        {report.trip.energyUsedKWh} kWh
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* XE ĐIỆN */}
                        {report.vehicle && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <Car className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    Xe điện
                                </h3>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg space-y-2 text-sm border border-indigo-200 dark:border-indigo-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <p>
                                            <strong className="text-gray-700 dark:text-gray-300">Hãng xe:</strong>{' '}
                                            {report.vehicle.make} {report.vehicle.model}
                                        </p>
                                        <p>
                                            <strong className="text-gray-700 dark:text-gray-300">Năm sản xuất:</strong>{' '}
                                            {report.vehicle.year}
                                        </p>
                                        <p>
                                            <strong className="text-gray-700 dark:text-gray-300">VIN:</strong>{' '}
                                            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                                {report.vehicle.vin}
                                            </span>
                                        </p>
                                        <p>
                                            <strong className="text-gray-700 dark:text-gray-300">Dung lượng pin:</strong>{' '}
                                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                                                {report.vehicle.batteryCapacityKWh} kWh
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
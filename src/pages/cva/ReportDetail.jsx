// src/pages/cva/ReportDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { ArrowLeft, Download, User, Calendar, CheckCircle, XCircle, Clock, Car } from 'lucide-react';

export const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    if (!report) {
        return (
            <Layout>
                <div className="p-8 text-center text-red-600">
                    <XCircle className="h-12 w-12 mx-auto mb-3" />
                    <p>Không tìm thấy báo cáo</p>
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
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Quay lại
                    </button>
                    {report.status !== 'Submitted' && (
                        <button
                            onClick={downloadPdf}
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                        >
                            <Download className="h-5 w-5" />
                            Tải PDF
                        </button>
                    )}
                </div>

                {/* CARD */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Báo cáo #{id.substring(0, 8).toUpperCase()}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Ngày nộp: {new Date(report.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chủ sở hữu */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <User className="h-5 w-5 text-emerald-600" />
                                Chủ sở hữu
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{report.user.fullName}</p>
                                <p className="text-sm text-gray-600">{report.user.email}</p>
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                {report.status === 'Submitted' ?
                                    <Clock className="h-5 w-5 text-yellow-600" /> :
                                    report.status === 'Approved' ?
                                        <CheckCircle className="h-5 w-5 text-green-600" /> :
                                        <XCircle className="h-5 w-5 text-red-600" />
                                }
                                Trạng thái
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className={`font-bold text-lg ${report.status === 'Submitted' ? 'text-yellow-600' :
                                    report.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {report.status === 'Submitted' ? 'Chưa xử lý' :
                                        report.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                                </p>

                                {/* NGƯỜI DUYỆT: CÓ → TÊN | KHÔNG → CHƯA CÓ */}
                                <p className="text-sm text-gray-600 mt-1">
                                    Người duyệt: {' '}
                                    <span className={report.cvaReviewer ? 'font-medium' : 'italic text-gray-500'}>
                                        {report.cvaReviewer?.fullName || 'Chưa có người duyệt đơn'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Dữ liệu */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Dữ liệu phát thải</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                                    <span className="font-medium">CO₂ giảm</span>
                                    <span className="font-bold text-emerald-700">
                                        {Number(report.reducedCO2Kg).toLocaleString()} kg
                                    </span>
                                </div>
                                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="font-medium">Tín chỉ</span>
                                    <span className="font-bold text-blue-700">
                                        {report.creditsEquivalent}
                                    </span>
                                </div>
                                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Phương pháp</span>
                                    <span className="text-sm">{report.calculationMethod || 'Không có'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chuyến đi */}
                        {report.trip && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    Thông tin chuyến đi
                                </h3>
                                <div className="bg-purple-50 p-4 rounded-lg space-y-2 text-sm">
                                    <p><strong>Thời gian:</strong> {new Date(report.trip.startTime).toLocaleString('vi-VN')} to {new Date(report.trip.endTime).toLocaleString('vi-VN')}</p>
                                    <p><strong>Khoảng cách:</strong> {report.trip.distanceKm} km</p>
                                    <p><strong>Năng lượng:</strong> {report.trip.energyUsedKWh} kWh</p>
                                </div>
                            </div>
                        )}

                        {/* Xe điện */}
                        {report.vehicle && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Car className="h-5 w-5 text-indigo-600" />
                                    Xe điện
                                </h3>
                                <div className="bg-indigo-50 p-4 rounded-lg space-y-2 text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <p><strong>Hãng xe:</strong> {report.vehicle.make} {report.vehicle.model}</p>
                                        <p><strong>Năm sản xuất:</strong> {report.vehicle.year}</p>
                                        <p><strong>VIN:</strong> <span className="font-mono text-xs">{report.vehicle.vin}</span></p>
                                        <p><strong>Dung lượng pin:</strong> <span className="font-semibold text-indigo-700">{report.vehicle.batteryCapacityKWh} kWh</span></p>
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
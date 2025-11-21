// src/pages/buyer/WalletCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { buyerService } from '../../services/buyerService';

export default function WalletCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState < 'loading' | 'success' | 'failed' > ('loading');
    const [message, setMessage] = useState('Đang xử lý thanh toán...');

    useEffect(() => {
        const processCallback = async () => {
            const vnpResponseCode = searchParams.get('vnp_ResponseCode');
            const vnpTxnRef = searchParams.get('vnp_TxnRef');

            if (vnpResponseCode === '00') {
                setStatus('success');
                setMessage(`Nạp tiền thành công! Mã giao dịch: ${vnpTxnRef}`);

                // Tự động reload ví sau 2s
                setTimeout(() => {
                    navigate('/buyer/wallet');
                }, 3000);
            } else {
                setStatus('failed');
                setMessage('Thanh toán thất bại hoặc đã hủy. Vui lòng thử lại.');
            }
        };

        processCallback();
    }, [searchParams, navigate]);

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Đang xử lý...</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Thành công!</h2>
                            <p className="text-gray-700 dark:text-gray-300 mt-4">{message}</p>
                            <p className="text-sm text-gray-500 mt-6">Đang chuyển về ví...</p>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Thất bại</h2>
                            <p className="text-gray-700 dark:text-gray-300 mt-4">{message}</p>
                            <button
                                onClick={() => navigate('/buyer/wallet/deposit')}
                                className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                            >
                                Thử lại
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
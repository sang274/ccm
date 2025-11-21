import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Award, Download, Eye, Calendar, Package, CheckCircle } from 'lucide-react';
import { buyerService } from '../../services/buyerService';
import { useAuth } from '../../contexts/AuthContext';

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await buyerService.getPurchaseHistory(user.id);
      const transactions = response.data || [];
      
      // Get certificates from transactions
      const certs = transactions
        .filter(t => t.certificate)
        .map(t => t.certificate);
      
      setCertificates(certs);
    } catch (error) {
      console.error('Error loading certificates:', error);
      // Mock data for demo
      setCertificates([
        {
          id: '1',
          transactionId: 'TXN001',
          buyerId: user?.id,
          creditAmount: 50,
          issueDate: new Date().toISOString(),
          certificateNumber: 'CERT-2025-001',
          status: 'active',
          sellerName: 'Green Energy Co.',
          region: 'Hà Nội'
        },
        {
          id: '2',
          transactionId: 'TXN002',
          buyerId: user?.id,
          creditAmount: 30,
          issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          certificateNumber: 'CERT-2025-002',
          status: 'active',
          sellerName: 'EV Solutions',
          region: 'TP.HCM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (cert) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  const handleDownloadCertificate = (cert) => {
    // In a real app, this would download a PDF
    alert(`Đang tải chứng nhận ${cert.certificateNumber}...`);
  };

  const totalCredits = certificates.reduce((sum, cert) => sum + cert.creditAmount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chứng nhận tín chỉ</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý các chứng nhận carbon credit của bạn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-100">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng chứng nhận</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tín chỉ</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCredits} tấn</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-300">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {certificates.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Bạn chưa có chứng nhận nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert.id}
                className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp animation-delay-${(index + 4) * 100}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                      <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {cert.certificateNumber}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cert.sellerName}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold rounded-full">
                    Hoạt động
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Số lượng:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {cert.creditAmount} tấn CO2
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày cấp:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(cert.issueDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewCertificate(cert)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 transform"
                  >
                    <Eye className="h-4 w-4" />
                    Xem
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(cert)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform"
                  >
                    <Download className="h-4 w-4" />
                    Tải về
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Modal */}
        {showModal && selectedCert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-8 animate-fadeInScale">
              <div className="text-center mb-6">
                <Award className="h-16 w-16 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Chứng nhận tín chỉ Carbon
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedCert.certificateNumber}
                </p>
              </div>

              <div className="border-2 border-emerald-600 dark:border-emerald-400 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Người nhận:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{user?.fullName || user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Người bán:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedCert.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Số lượng tín chỉ:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedCert.creditAmount} tấn CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ngày cấp:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedCert.issueDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-semibold rounded-full">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadCertificate(selectedCert)}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300"
                >
                  <Download className="h-5 w-5" />
                  Tải về PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

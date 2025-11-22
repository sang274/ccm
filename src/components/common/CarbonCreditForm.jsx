import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { X, AlertCircle, Package, Info, Sparkles, CheckCircle2, TrendingUp, Calendar, Zap } from 'lucide-react';
=======
import { X, AlertCircle, Package, Info } from 'lucide-react';
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
import { carbonCreditService } from '../../services/carbonCreditService';
import { emissionReductionService } from '../../services/emissionReductionService';
import { useAuth } from '../../contexts/AuthContext';

export default function CarbonCreditForm({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    reductionId: '',
    totalUnits: '',
    metadata: ''
  });
  const [emissionReductions, setEmissionReductions] = useState([]);
<<<<<<< HEAD
  const [selectedReduction, setSelectedReduction] = useState(null);
=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
  const [loading, setLoading] = useState(false);
  const [loadingReductions, setLoadingReductions] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
<<<<<<< HEAD
  const [successMessage, setSuccessMessage] = useState('');
=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d

  // Load emission reductions when component mounts
  useEffect(() => {
    if (isOpen && user) {
      loadEmissionReductions();
<<<<<<< HEAD
      // Reset form when opening
      setFormData({
        reductionId: '',
        totalUnits: '',
        metadata: ''
      });
      setSelectedReduction(null);
      setErrors({});
      setApiError('');
      setSuccessMessage('');
=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
    }
  }, [isOpen, user]);

  const loadEmissionReductions = async () => {
    try {
      setLoadingReductions(true);
      // Get verified emission reductions for the current user
      const reductions = await emissionReductionService.getVerified(user.id);
      setEmissionReductions(reductions || []);
    } catch (error) {
      console.error('Error loading emission reductions:', error);
      // Fallback data for demonstration
      setEmissionReductions([
        {
          id: '1',
          tripId: 'trip-1',
          userId: user.id,
          reducedCO2Kg: 25.5,
          creditsEquivalent: 0.0255,
          calculationMethod: 'EV vs ICE Comparison',
          createdAt: new Date().toISOString(),
          status: 1 // Approved
        }
      ]);
    } finally {
      setLoadingReductions(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reductionId) {
      newErrors.reductionId = 'Vui lòng chọn dữ liệu giảm phát thải';
    }

    if (!formData.totalUnits || parseFloat(formData.totalUnits) <= 0) {
      newErrors.totalUnits = 'Số lượng tín chỉ phải lớn hơn 0';
    }

<<<<<<< HEAD
    // Validate that totalUnits doesn't exceed creditsEquivalent
    if (selectedReduction && parseFloat(formData.totalUnits) > selectedReduction.creditsEquivalent) {
      newErrors.totalUnits = `Số lượng không được vượt quá ${selectedReduction.creditsEquivalent.toFixed(4)} tấn CO₂`;
    }

=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      setLoading(true);
      setApiError('');
<<<<<<< HEAD
      setSuccessMessage('');
=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d

      const creditData = {
        reductionId: formData.reductionId,
        ownerId: user.id,
        totalUnits: parseFloat(formData.totalUnits),
        availableUnits: parseFloat(formData.totalUnits),
        issuedAt: new Date().toISOString(),
<<<<<<< HEAD
        metadata: formData.metadata ? { 
          description: formData.metadata,
          createdFrom: 'CarbonCreditForm',
          reductionMethod: selectedReduction?.calculationMethod || 'Unknown'
        } : null
=======
        metadata: formData.metadata ? { description: formData.metadata } : null
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
      };

      const result = await carbonCreditService.create(creditData);
      
<<<<<<< HEAD
      // Show success message
      setSuccessMessage('Tạo tín chỉ carbon thành công! Đang cập nhật...');
      
      // Wait a bit to show success message
      setTimeout(() => {
        // Reset form
        setFormData({
          reductionId: '',
          totalUnits: '',
          metadata: ''
        });
        setSelectedReduction(null);
        
        onSuccess(result);
        onClose();
      }, 1500);
      
=======
      // Reset form
      setFormData({
        reductionId: '',
        totalUnits: '',
        metadata: ''
      });
      
      onSuccess(result);
      onClose();
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
    } catch (error) {
      console.error('Error creating carbon credit:', error);
      
      if (error.response?.data) {
        // Handle different types of API error responses
        if (typeof error.response.data === 'string') {
          setApiError(error.response.data);
        } else if (error.response.data.title && error.response.data.errors) {
          // Handle ASP.NET Core validation error format
          const validationErrors = error.response.data.errors;
          const formattedErrors = {};
          
          Object.keys(validationErrors).forEach(field => {
            const fieldName = field.toLowerCase().replace('carboncreditdto.', '');
            if (fieldName === 'reductionid') formattedErrors.reductionId = validationErrors[field][0];
            else if (fieldName === 'totalunits') formattedErrors.totalUnits = validationErrors[field][0];
            else formattedErrors[fieldName] = validationErrors[field][0];
          });
          
          if (Object.keys(formattedErrors).length > 0) {
            setErrors(formattedErrors);
            return;
          }
          
          setApiError(error.response.data.title || 'Lỗi validation');
        } else if (error.response.data.message) {
          setApiError(error.response.data.message);
        } else if (error.response.status === 400) {
          // Handle BadRequest with string message
          setApiError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
        }
      } else {
        setApiError('Có lỗi xảy ra khi tạo tín chỉ carbon. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
<<<<<<< HEAD
    
    // Clear API error when user changes any field
    if (apiError) {
      setApiError('');
    }
  };

  const handleReductionChange = (reductionId) => {
    const reduction = emissionReductions.find(r => r.id === reductionId);
    setSelectedReduction(reduction);
    
    // Auto-fill totalUnits with creditsEquivalent
    if (reduction) {
      handleInputChange('totalUnits', reduction.creditsEquivalent?.toFixed(4) || '');
    }
    
    handleInputChange('reductionId', reductionId);
  };

  const handleAutoFill = () => {
    if (selectedReduction) {
      handleInputChange('totalUnits', selectedReduction.creditsEquivalent?.toFixed(4) || '');
    }
=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
  };

  if (!isOpen) return null;

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fadeInScale">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Tạo tín chỉ Carbon mới</h2>
                <p className="text-emerald-100 text-sm mt-1">Chuyển đổi giảm phát thải thành tín chỉ carbon</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={loading}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-fadeInUp">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-fadeInUp">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
=======
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInScale">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tạo tín chỉ Carbon</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
                <p className="text-red-800 dark:text-red-200 font-medium">Lỗi tạo tín chỉ</p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
<<<<<<< HEAD
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-blue-800 dark:text-blue-200 text-sm">
              <p className="font-semibold mb-1">💡 Hướng dẫn tạo tín chỉ</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>Chọn dữ liệu giảm phát thải đã được xác minh</li>
                <li>Hệ thống sẽ tự động tính toán số lượng tín chỉ</li>
                <li>Bạn có thể điều chỉnh số lượng theo nhu cầu</li>
              </ul>
=======
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-blue-800 dark:text-blue-200 text-sm">
              <p className="font-medium mb-1">Tạo tín chỉ carbon từ dữ liệu giảm phát thải</p>
              <p>Chọn một bản ghi giảm phát thải đã được xác minh để tạo tín chỉ carbon tương ứng.</p>
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
            </div>
          </div>

          <div className="space-y-6">
            {/* Emission Reduction Selection */}
            <div>
<<<<<<< HEAD
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Chọn dữ liệu giảm phát thải *
              </label>
              
              {loadingReductions ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
              ) : emissionReductions.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">Chưa có dữ liệu giảm phát thải</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Vui lòng thêm chuyến đi để tạo dữ liệu giảm phát thải</p>
                </div>
              ) : (
                <>
                  <select
                    value={formData.reductionId}
                    onChange={(e) => handleReductionChange(e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.reductionId ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                    }`}
                  >
                    <option value="">-- Chọn dữ liệu giảm phát thải --</option>
                    {emissionReductions.map((reduction) => (
                      <option key={reduction.id} value={reduction.id}>
                        {reduction.calculationMethod || 'Giảm phát thải'} - {reduction.reducedCO2Kg.toFixed(2)} kg CO₂ 
                        ({reduction.creditsEquivalent?.toFixed(4) || '0.0000'} tín chỉ) - {new Date(reduction.createdAt).toLocaleDateString('vi-VN')}
                      </option>
                    ))}
                  </select>

                  {/* Selected Reduction Details */}
                  {selectedReduction && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-fadeInUp">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                          <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                            {selectedReduction.calculationMethod || 'Dữ liệu giảm phát thải'}
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700 dark:text-emerald-300">
                                <strong>{selectedReduction.reducedCO2Kg.toFixed(2)}</strong> kg CO₂
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700 dark:text-emerald-300">
                                <strong>{selectedReduction.creditsEquivalent?.toFixed(4) || '0.0000'}</strong> tín chỉ
                              </span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700 dark:text-emerald-300">
                                {new Date(selectedReduction.createdAt).toLocaleDateString('vi-VN', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {errors.reductionId && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.reductionId}</p>
                </div>
=======
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn dữ liệu giảm phát thải *
              </label>
              {loadingReductions ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Đang tải dữ liệu...
                </div>
              ) : emissionReductions.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  Không có dữ liệu giảm phát thải nào. Vui lòng thêm chuyến đi trước.
                </div>
              ) : (
                <select
                  value={formData.reductionId}
                  onChange={(e) => handleInputChange('reductionId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.reductionId ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">-- Chọn dữ liệu giảm phát thải --</option>
                  {emissionReductions.map((reduction) => (
                    <option key={reduction.id} value={reduction.id}>
                      {reduction.calculationMethod || 'Giảm phát thải'} - {reduction.reducedCO2Kg.toFixed(2)} kg CO₂ 
                      ({reduction.creditsEquivalent?.toFixed(4) || '0.0000'} tín chỉ) - {new Date(reduction.createdAt).toLocaleDateString('vi-VN')}
                    </option>
                  ))}
                </select>
              )}
              {errors.reductionId && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.reductionId}</p>
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
              )}
            </div>

            {/* Total Units */}
            <div>
<<<<<<< HEAD
              <label className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Số lượng tín chỉ (tấn CO₂) *
                </div>
                {selectedReduction && (
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={loading}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" />
                    Tự động điền
                  </button>
                )}
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max={selectedReduction?.creditsEquivalent || undefined}
                  value={formData.totalUnits}
                  onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                  disabled={loading || !selectedReduction}
                  placeholder="VD: 0.0255"
                  className={`w-full px-4 py-3 pr-16 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.totalUnits ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  tấn
                </span>
              </div>
              
              {errors.totalUnits && (
                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <p>{errors.totalUnits}</p>
                </div>
              )}
              
              {selectedReduction && !errors.totalUnits && (
                <div className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Info className="h-4 w-4" />
                  <p>
                    Tối đa: <strong className="text-emerald-600 dark:text-emerald-400">
                      {selectedReduction.creditsEquivalent?.toFixed(4) || '0.0000'}
                    </strong> tấn CO₂
                  </p>
                </div>
              )}
              
              {!selectedReduction && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  Vui lòng chọn dữ liệu giảm phát thải trước
                </p>
              )}
=======
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số lượng tín chỉ (tấn CO₂) *
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={formData.totalUnits}
                onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                placeholder="VD: 0.0255"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.totalUnits ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.totalUnits && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.totalUnits}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Nhập số lượng tín chỉ tương ứng với lượng CO₂ giảm được (tấn)
              </p>
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
            </div>

            {/* Metadata */}
            <div>
<<<<<<< HEAD
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Info className="h-4 w-4 text-gray-500" />
                Ghi chú bổ sung <span className="text-gray-400 font-normal">(tùy chọn)</span>
=======
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú bổ sung (tùy chọn)
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
              </label>
              <textarea
                value={formData.metadata}
                onChange={(e) => handleInputChange('metadata', e.target.value)}
<<<<<<< HEAD
                disabled={loading}
                placeholder="Thông tin bổ sung về tín chỉ carbon này... (VD: Nguồn gốc, mục đích sử dụng, ghi chú đặc biệt...)"
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                Thông tin này sẽ được lưu trong metadata của tín chỉ
              </p>
=======
                placeholder="Thông tin bổ sung về tín chỉ này..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
            </div>
          </div>

          {/* Footer Actions */}
<<<<<<< HEAD
          <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading || emissionReductions.length === 0 || !formData.reductionId || !formData.totalUnits}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3.5 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                  <span>Đang tạo tín chỉ...</span>
                </>
              ) : successMessage ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Thành công!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Tạo tín chỉ Carbon</span>
=======
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading || emissionReductions.length === 0}
              className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5" />
                  Tạo tín chỉ
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
<<<<<<< HEAD
              className="px-6 py-3.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
=======
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold disabled:opacity-50"
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
            >
              Hủy
            </button>
          </div>
<<<<<<< HEAD

          {/* Quick Stats */}
          {selectedReduction && formData.totalUnits && !errors.totalUnits && (
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Tóm tắt tín chỉ sẽ tạo:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">CO₂ giảm</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedReduction.reducedCO2Kg.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">kg</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tín chỉ</p>
                  <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {parseFloat(formData.totalUnits).toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">tấn</p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trạng thái</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ✓
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sẵn sàng</p>
                </div>
              </div>
            </div>
          )}
=======
>>>>>>> ea2a2439eb87a360b1540d6f70fc2e5270bbfe6d
        </form>
      </div>
    </div>
  );
}
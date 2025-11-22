import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Package, Info } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [loadingReductions, setLoadingReductions] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Load emission reductions when component mounts
  useEffect(() => {
    if (isOpen && user) {
      loadEmissionReductions();
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    try {
      setLoading(true);
      setApiError('');

      const creditData = {
        reductionId: formData.reductionId,
        ownerId: user.id,
        totalUnits: parseFloat(formData.totalUnits),
        availableUnits: parseFloat(formData.totalUnits),
        issuedAt: new Date().toISOString(),
        metadata: formData.metadata ? { description: formData.metadata } : null
      };

      const result = await carbonCreditService.create(creditData);
      
      // Reset form
      setFormData({
        reductionId: '',
        totalUnits: '',
        metadata: ''
      });
      
      onSuccess(result);
      onClose();
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
  };

  if (!isOpen) return null;

  return (
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
                <p className="text-red-800 dark:text-red-200 font-medium">Lỗi tạo tín chỉ</p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-blue-800 dark:text-blue-200 text-sm">
              <p className="font-medium mb-1">Tạo tín chỉ carbon từ dữ liệu giảm phát thải</p>
              <p>Chọn một bản ghi giảm phát thải đã được xác minh để tạo tín chỉ carbon tương ứng.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Emission Reduction Selection */}
            <div>
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
              )}
            </div>

            {/* Total Units */}
            <div>
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
            </div>

            {/* Metadata */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú bổ sung (tùy chọn)
              </label>
              <textarea
                value={formData.metadata}
                onChange={(e) => handleInputChange('metadata', e.target.value)}
                placeholder="Thông tin bổ sung về tín chỉ này..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
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
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
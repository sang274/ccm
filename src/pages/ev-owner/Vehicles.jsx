import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Car, Plus, Edit, Trash2, Battery, Calendar } from 'lucide-react';
import { evOwnerService } from '../../services/evOwnerService';

export default function EVOwnerVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    batteryCapacity: ''
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await evOwnerService.getVehicles();
      console.log('Vehicles response:', response);
      
      // Handle different response formats
      let vehicleList = [];
      if (response.success && response.data) {
        vehicleList = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response.data)) {
        vehicleList = response.data;
      } else if (Array.isArray(response)) {
        vehicleList = response;
      } else if (response.data) {
        vehicleList = [response.data];
      }
      
      setVehicles(vehicleList);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!formData.make || !formData.model || !formData.vin) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setAdding(true);
      await evOwnerService.addVehicle({
        vin: formData.vin,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        batteryCapacityKWh: Number(formData.batteryCapacity)
      });
      alert('Thêm xe thành công!');
      setShowAddModal(false);
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        batteryCapacity: ''
      });
      loadVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      
      // Check if it's a foreign key constraint error
      if (error.response?.data?.message?.includes('foreign key constraint') || 
          error.response?.data?.message?.includes('FK_Vehicles_Users_UserId')) {
        alert('Lỗi xác thực người dùng. Vui lòng đăng xuất và đăng nhập lại.');
      } else {
        alert('Không thể thêm xe. Vui lòng thử lại sau.\n\nChi tiết: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Xe của tôi</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý xe điện của bạn</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform shadow-lg font-semibold"
          >
            <Plus className="h-5 w-5" />
            Thêm xe
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-100">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                <Car className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số xe</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{vehicles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Battery className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dung lượng pin TB</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {vehicles.length > 0 
                    ? Math.round(vehicles.reduce((sum, v) => sum + (v.batteryCapacityKWh || 0), 0) / vehicles.length)
                    : 0} kWh
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp animation-delay-300">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Năm mới nhất</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {vehicles.length > 0 ? Math.max(...vehicles.map(v => v.year)) : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl animate-fadeInUp animation-delay-400">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">Chưa có xe nào được đăng ký</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105 transform font-semibold"
            >
              <Plus className="h-5 w-5" />
              Thêm xe đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp animation-delay-${(index + 4) * 100}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                    <Car className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Năm {vehicle.year}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">VIN:</span>
                    <span className="font-mono text-xs text-gray-900 dark:text-white">{vehicle.vin}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Dung lượng pin:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vehicle.batteryCapacityKWh} kWh</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
                    <Edit className="h-4 w-4" />
                    Sửa
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all text-sm font-medium">
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Vehicle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-8 animate-fadeInScale max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thêm xe mới</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hãng xe *
                    </label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => setFormData({...formData, make: e.target.value})}
                      placeholder="VD: Tesla, VinFast"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      placeholder="VD: Model 3, VF8"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Năm sản xuất *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dung lượng pin (kWh) *
                    </label>
                    <input
                      type="number"
                      value={formData.batteryCapacity}
                      onChange={(e) => setFormData({...formData, batteryCapacity: e.target.value})}
                      placeholder="VD: 75"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số VIN *
                  </label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value})}
                    placeholder="VD: 5YJ3E1EA1KF123456"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddVehicle}
                  disabled={adding}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {adding ? 'Đang thêm...' : 'Thêm xe'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

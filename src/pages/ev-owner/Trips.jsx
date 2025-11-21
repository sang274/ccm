import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Upload, Plus, Calendar, MapPin, Car, TrendingUp, FileText, X, Check } from 'lucide-react';
import { evOwnerService } from '../../services/evOwnerService';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [creating, setCreating] = useState(false);

  // Manual trip form
  const [tripForm, setTripForm] = useState({
    vehicleId: '',
    startTime: '',
    endTime: '',
    distanceKm: '',
    energyUsedKWh: ''
  });

  // File import
  const [selectedFile, setSelectedFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData] = await Promise.all([
        evOwnerService.getTrips(),
        evOwnerService.getVehicles()
      ]);
      setTrips(tripsData.data || []);
      setVehicles(vehiclesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setTrips([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!tripForm.vehicleId || !tripForm.distanceKm) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setCreating(true);
      await evOwnerService.createTrip({
        vehicleId: tripForm.vehicleId,
        startTime: tripForm.startTime || undefined,
        endTime: tripForm.endTime || undefined,
        distanceKm: Number(tripForm.distanceKm),
        energyUsedKWh: tripForm.energyUsedKWh ? Number(tripForm.energyUsedKWh) : undefined
      });
      alert('Tạo chuyến đi thành công!');
      setShowManualModal(false);
      setTripForm({
        vehicleId: '',
        startTime: '',
        endTime: '',
        distanceKm: '',
        energyUsedKWh: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Không thể tạo chuyến đi');
    } finally {
      setCreating(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header if exists
        const dataLines = lines[0].toLowerCase().includes('vehicle') ? lines.slice(1) : lines;
        
        const parsed = dataLines.map((line, index) => {
          const parts = line.split(',').map(p => p.trim());
          return {
            id: index,
            vehicleId: parts[0] || '',
            startTime: parts[1] || '',
            endTime: parts[2] || '',
            distanceKm: parts[3] || '',
            energyUsedKWh: parts[4] || ''
          };
        }).filter(trip => trip.vehicleId && trip.distanceKm);

        setImportPreview(parsed);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Không thể đọc file. Vui lòng kiểm tra định dạng.');
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (importPreview.length === 0) {
      alert('Không có dữ liệu để import');
      return;
    }

    try {
      setImporting(true);
      for (const trip of importPreview) {
        await evOwnerService.createTrip({
          vehicleId: trip.vehicleId,
          startTime: trip.startTime || undefined,
          endTime: trip.endTime || undefined,
          distanceKm: Number(trip.distanceKm),
          energyUsedKWh: trip.energyUsedKWh ? Number(trip.energyUsedKWh) : undefined
        });
      }
      alert(`Import thành công ${importPreview.length} chuyến đi!`);
      setShowImportModal(false);
      setSelectedFile(null);
      setImportPreview([]);
      loadData();
    } catch (error) {
      console.error('Error importing trips:', error);
      alert('Có lỗi xảy ra khi import');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'vehicleId,startTime,endTime,distanceKm,energyUsedKWh\n<your-vehicle-id>,2024-01-01T08:00,2024-01-01T10:00,120,35.5';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trip_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distanceKm || 0), 0);
  const totalCO2Saved = (totalDistance * 0.12).toFixed(2);

  return (
    <>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="animate-fadeInUp">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hành trình</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý các chuyến đi của bạn</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-100">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Tổng chuyến đi</p>
                  <p className="text-3xl font-bold">{trips.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-emerald-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Tổng quãng đường</p>
                  <p className="text-3xl font-bold">{totalDistance.toFixed(0)} km</p>
                </div>
                <MapPin className="h-12 w-12 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">CO₂ tiết kiệm</p>
                  <p className="text-3xl font-bold">{totalCO2Saved} kg</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-200" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeInUp animation-delay-200">
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowManualModal(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-all font-semibold"
              >
                <Plus className="h-5 w-5" />
                Thêm chuyến đi thủ công
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold"
              >
                <Upload className="h-5 w-5" />
                Import từ file
              </button>
              <button
                onClick={downloadTemplate}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 dark:bg-gray-700 text-white px-6 py-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all font-semibold"
              >
                <FileText className="h-5 w-5" />
                Tải mẫu CSV
              </button>
            </div>
          </div>

          {/* Trips List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeInUp animation-delay-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Danh sách chuyến đi</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa có chuyến đi nào</p>
                <button
                  onClick={() => setShowManualModal(true)}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Thêm chuyến đi đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                          <Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              Chuyến đi #{trip.id.substring(0, 8)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Quãng đường:</span>
                              <span className="ml-1 font-semibold text-gray-900 dark:text-white">{trip.distanceKm || 0} km</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Năng lượng:</span>
                              <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                                {trip.energyUsedKWh ? `${trip.energyUsedKWh} kWh` : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">CO₂ tiết kiệm:</span>
                              <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                                {((trip.distanceKm || 0) * 0.12).toFixed(2)} kg
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                              <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                                {trip.startTime ? new Date(trip.startTime).toLocaleDateString('vi-VN') : 'N/A'}
                              </span>
                            </div>
                          </div>
                          {trip.startTime && trip.endTime && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              {new Date(trip.startTime).toLocaleTimeString('vi-VN')} - {new Date(trip.endTime).toLocaleTimeString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>

      {/* Manual Input Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-fadeInScale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thêm chuyến đi mới</h3>
              <button onClick={() => setShowManualModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Xe *</label>
                <select
                  value={tripForm.vehicleId}
                  onChange={(e) => setTripForm({...tripForm, vehicleId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Chọn xe</option>
                  {vehicles.map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.make} {v.model} ({v.year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quãng đường (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tripForm.distanceKm}
                    onChange={(e) => setTripForm({...tripForm, distanceKm: e.target.value})}
                    placeholder="VD: 120"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Năng lượng (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tripForm.energyUsedKWh}
                    onChange={(e) => setTripForm({...tripForm, energyUsedKWh: e.target.value})}
                    placeholder="VD: 35.5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={tripForm.startTime}
                    onChange={(e) => setTripForm({...tripForm, startTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thời gian kết thúc</label>
                  <input
                    type="datetime-local"
                    value={tripForm.endTime}
                    onChange={(e) => setTripForm({...tripForm, endTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleManualSubmit}
                disabled={creating}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-semibold"
              >
                {creating ? 'Đang tạo...' : 'Tạo chuyến đi'}
              </button>
              <button
                onClick={() => setShowManualModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto animate-fadeInScale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Import chuyến đi từ file</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  💡 File CSV phải có định dạng: vehicleId, startTime, endTime, distanceKm, energyUsedKWh
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chọn file CSV</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Xem trước ({importPreview.length} chuyến đi)
                  </h4>
                  <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Xe</th>
                          <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">KM</th>
                          <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">kWh</th>
                          <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Bắt đầu</th>
                          <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Kết thúc</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800">
                        {importPreview.map((trip) => (
                          <tr key={trip.id} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-3 py-2 text-gray-900 dark:text-white">{trip.vehicleId}</td>
                            <td className="px-3 py-2 text-gray-900 dark:text-white">{trip.distanceKm}</td>
                            <td className="px-3 py-2 text-gray-900 dark:text-white">{trip.energyUsedKWh || 'N/A'}</td>
                            <td className="px-3 py-2 text-gray-900 dark:text-white">{trip.startTime || 'N/A'}</td>
                            <td className="px-3 py-2 text-gray-900 dark:text-white">{trip.endTime || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleImport}
                disabled={importing || importPreview.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-semibold"
              >
                <Check className="h-5 w-5" />
                {importing ? 'Đang import...' : `Import ${importPreview.length} chuyến đi`}
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

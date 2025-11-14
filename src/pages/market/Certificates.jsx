import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm load dữ liệu chứng nhận
  async function loadCertificates() {
    setLoading(true);
    setError(null);
    try {
      // Thử lấy từ endpoint /certificates
      let res = await fetch(`${API_BASE}/certificates`);
      if (res.ok) {
        const data = await res.json();
        setCerts(Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : []);
        return;
      }

      // Fallback: lấy từ transactions và trích xuất certificateUrl
      res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) throw new Error('Không thể lấy chứng nhận từ transactions.');
      const tx = await res.json();
      const list = (tx.items || tx || []).map((t) => ({
        id: t.id,
        title: t.title || t.orderId || `Giao dịch #${t.id}`,
        issuedAt: t.issuedAt || t.createdAt || new Date().toISOString(),
        downloadUrl: t.certificateUrl,
      }));
      setCerts(list.filter((c) => c.downloadUrl));
    } catch (e) {
      console.error('Lỗi khi tải chứng nhận:', e);
      setError(`Lỗi: ${e.message}. Vui lòng thử lại sau.`);
      // Fallback dữ liệu mẫu nếu cả hai API thất bại
      setCerts([
        {
          id: 'demo-1',
          title: 'Chứng nhận demo - Rừng A',
          issuedAt: '2025-11-01T10:00:00Z',
          downloadUrl: '#', // URL giả lập, thay bằng link thực tế
        },
        {
          id: 'demo-2',
          title: 'Chứng nhận demo - Trồng cây',
          issuedAt: '2025-11-02T14:00:00Z',
          downloadUrl: '#',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Gọi load khi component mount
  useEffect(() => {
    loadCertificates();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chứng nhận tín chỉ</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {loading && <div>Đang tải...</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-slate-500">
                  Ngày cấp: {new Date(c.issuedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                </p>
              </div>
              <div>
                <a
                  href={c.downloadUrl || '#'}
                  className="px-3 py-2 bg-sky-600 text-white rounded"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tải
                </a>
              </div>
            </div>
            <p className="mt-3 text-slate-700">{c.summary || 'Không có mô tả'}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
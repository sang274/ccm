import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Thêm nếu cần liên kết nội bộ

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm load dữ liệu
  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Gọi API để lấy danh sách phiên đấu giá
      const res = await fetch(`${API_BASE}/auctions`);
      if (!res.ok) {
        throw new Error('Không tìm thấy phiên đấu giá (backend chưa có). Hiện đang hiển thị dữ liệu mẫu.');
      }
      const data = await res.json();
      // Xử lý dữ liệu, ưu tiên mảng items nếu có, nếu không dùng toàn bộ data
      setAuctions(Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : []);
    } catch (e) {
      // Fallback đến dữ liệu mẫu nếu API thất bại
      setError(e.message);
      setAuctions([
        {
          id: 'demo-1',
          title: 'Phiên đấu giá demo - Rừng B',
          startAt: '2025-11-01T10:00:00Z', // Thời gian cố định
          currentBid: 12.5,
          quantity: 100,
          description: 'Phiên đấu giá demo cho rừng B',
        },
        {
          id: 'demo-2',
          title: 'Phiên đấu giá demo - Trồng rừng',
          startAt: '2025-11-02T14:00:00Z', // Thời gian cố định
          currentBid: 8.2,
          quantity: 50,
          description: 'Phiên đấu giá demo cho trồng rừng',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Hàm tham gia đấu giá
  async function joinAuction(aid) {
    try {
      const res = await fetch(`${API_BASE}/auctions/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId: aid }),
      });
      if (!res.ok) throw new Error('Không thể tham gia đấu giá.');
      alert('Đăng ký tham gia đấu giá thành công (kiểm tra email).');
    } catch (e) {
      alert('Lỗi: ' + e.message);
    }
  }

  // Gọi load khi component mount
  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Phiên đấu giá</h1>
      {error && <div className="text-yellow-700 mb-3">{error}</div>}
      {loading && <div>Đang tải...</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {auctions.map((a) => (
          <div key={a.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-slate-500">
                  Bắt đầu: {new Date(a.startAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold">Hiện tại: ${a.currentBid}</div>
                <div className="text-sm">Số lượng: {a.quantity} tấn</div>
              </div>
            </div>
            <p className="mt-3 text-slate-700">{a.description}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => joinAuction(a.id)}
                className="px-3 py-2 bg-sky-600 text-white rounded"
              >
                Tham gia
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
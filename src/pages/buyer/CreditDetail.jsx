import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Sử dụng biến môi trường Vite hoặc fallback URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';

const CreditDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const loadingText = 'Đang tải...';
  const errorText = 'Lỗi';
  const notFoundText = 'Không tìm thấy';

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/CarbonCredit/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy tín chỉ');
        const data = await res.json();
        setCredit(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);


  if (loading) return <main className="p-6">{loadingText}</main>;
  if (error) return <main className="p-6 text-red-600">{errorText}: {error}</main>;
  if (!credit) return <main className="p-6">{notFoundText}</main>;

  
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{credit.title}</h1>
            <p className="text-sm text-slate-500">
              {credit.region} • {credit.standard}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold">${credit.price}</div>
            <div className="text-sm">{credit.quantity} tấn</div>
          </div>
        </div>

        <div className="mt-4 text-slate-700">{credit.description}</div>

        <div className="mt-6 flex gap-3">
          <Link
            to={`/market/checkout?creditId=${credit.id}`}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Mua ngay
          </Link>
          <button
            onClick={() => navigate('/buyer/auctions')}
            className="px-4 py-2 border rounded"
          >
            Xem đấu giá
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreditDetail;
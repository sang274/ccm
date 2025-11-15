import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Award, TrendingUp, Package } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';

export const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    purchases: 0,
    certificates: 0,
    transactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load statistics data
  async function loadStats() {
    setLoading(true);
    setError(null);
    try {
      // Fetch number of purchased credits
      const purchasesRes = await fetch(`${API_BASE}/buyer/purchases`);
      if (!purchasesRes.ok) throw new Error('Unable to fetch purchase data.');
      const purchasesData = await purchasesRes.json();
      const purchasesCount = Array.isArray(purchasesData.items)
        ? purchasesData.items.length
        : Array.isArray(purchasesData)
        ? purchasesData.length
        : 0;

      // Fetch number of certificates
      const certsRes = await fetch(`${API_BASE}/certificates`);
      if (!certsRes.ok) throw new Error('Unable to fetch certificate data.');
      const certsData = await certsRes.json();
      const certsCount = Array.isArray(certsData.items)
        ? certsData.items.length
        : Array.isArray(certsData)
        ? certsData.length
        : 0;

      // Fetch number of transactions
      const transactionsRes = await fetch(`${API_BASE}/transactions`);
      if (!transactionsRes.ok) throw new Error('Unable to fetch transaction data.');
      const transactionsData = await transactionsRes.json();
      const transactionsCount = Array.isArray(transactionsData.items)
        ? transactionsData.items.length
        : Array.isArray(transactionsData)
        ? transactionsData.length
        : 0;

      setStats({
        purchases: purchasesCount,
        certificates: certsCount,
        transactions: transactionsCount,
      });
    } catch (e) {
      setError(`Error: ${e.message}. Please try again later.`);
      setStats({
        purchases: 0,
        certificates: 0,
        transactions: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  // Load stats when component mounts
  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.fullName || user?.email}</p>
        </div>

        {error && <div className="text-red-600 mb-6">{error}</div>}
        {loading && <div className="text-gray-600">Loading...</div>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/buyer/marketplace"
              className="flex items-center justify-between bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <ShoppingCart className="h-12 w-12" />
                <div>
                  <h3 className="text-xl font-bold">Marketplace</h3>
                  <p className="text-blue-100">Purchase carbon credits</p>
                </div>
              </div>
              <div className="text-sm bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                {stats.purchases} credits
              </div>
            </Link>

            <Link
              to="/buyer/my-purchases"
              className="flex items-center justify-between bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <Package className="h-12 w-12" />
                <div>
                  <h3 className="text-xl font-bold">Purchases</h3>
                  <p className="text-green-100">View your purchase history</p>
                </div>
              </div>
              <div className="text-sm bg-green-100 text-green-800 rounded-full px-3 py-1">
                {stats.transactions} transactions
              </div>
            </Link>

            <Link
              to="/buyer/certificates"
              className="flex items-center justify-between bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <Award className="h-12 w-12" />
                <div>
                  <h3 className="text-xl font-bold">Certificates</h3>
                  <p className="text-purple-100">Manage your certificates</p>
                </div>
              </div>
              <div className="text-sm bg-purple-100 text-purple-800 rounded-full px-3 py-1">
                {stats.certificates} certificates
              </div>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

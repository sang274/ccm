// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RootRedirect } from './components/RootRedirect';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EVOwnerDashboard } from './pages/ev-owner/Dashboard';
import EVOwnerWallet from './pages/ev-owner/Wallet';
import EVOwnerListings from './pages/ev-owner/Listings';
import EVOwnerVehicles from './pages/ev-owner/Vehicles';
import EVOwnerCarbonCredits from './pages/ev-owner/CarbonCredits';
import { BuyerDashboard } from './pages/buyer/Dashboard';
import { CVADashboard } from './pages/cva/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';

// CVA pages
import { Verifications } from './pages/cva/Verifications';
import { VerificationDetail } from './pages/cva/VerificationDetail';
import { Reports as CVAReports } from './pages/cva/Reports';
import { ReportDetail } from './pages/cva/ReportDetail';

// BUYER pages
import Market from './pages/buyer/Market';
import CreditDetail from './pages/buyer/CreditDetail';
import Auctions from './pages/buyer/Auctions';
import Certificates from './pages/buyer/Certificates';
import PurchaseHistory from './pages/buyer/PurchaseHistory';
import Wallet from './pages/buyer/Wallet';
import Deposit from './pages/buyer/Deposit';

// Admin pages
import { Users } from './pages/admin/Users';
import { Transactions } from './pages/admin/Transactions';
import { Wallets } from './pages/admin/Wallets';
import { Listings } from './pages/admin/Listings';
import { Reports as AdminReports } from './pages/admin/Reports';

const Unauthorized = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600">Bạn không có quyền truy cập trang này</p>
    </div>
);

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="/" element={<RootRedirect />} />

                        {/* DASHBOARDS */}
                        <Route
                            path="/ev-owner/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={[0]}>
                                    <EVOwnerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ev-owner/wallet"
                            element={
                                <ProtectedRoute allowedRoles={[0]}>
                                    <EVOwnerWallet />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ev-owner/listings"
                            element={
                                <ProtectedRoute allowedRoles={[0]}>
                                    <EVOwnerListings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ev-owner/vehicles"
                            element={
                                <ProtectedRoute allowedRoles={[0]}>
                                    <EVOwnerVehicles />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ev-owner/carbon-credits"
                            element={
                                <ProtectedRoute allowedRoles={[0]}>
                                    <EVOwnerCarbonCredits />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <BuyerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/cva/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={[2]}>
                                    <CVADashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={[3]}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* CVA VERIFICATIONS */}
                        <Route
                            path="/cva/verifications"
                            element={
                                <ProtectedRoute allowedRoles={[2]}>
                                    <Verifications />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/cva/verification/:id"
                            element={
                                <ProtectedRoute allowedRoles={[2]}>
                                    <VerificationDetail />
                                </ProtectedRoute>
                            }
                        />

                        {/* BUYER MARKET */}
                        <Route
                            path="/market"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <Market />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/credit/:id"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <CreditDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/auctions"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <Auctions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/certificates"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <Certificates />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/purchase-history"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <PurchaseHistory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/wallet"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <Wallet />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/buyer/wallet/deposit"
                            element={
                                <ProtectedRoute allowedRoles={[1]}>
                                    <Deposit />
                                </ProtectedRoute>
                            }
                        />

                        {/* CVA REPORTS */}
                        <Route
                            path="/cva/reports"
                            element={
                                <ProtectedRoute allowedRoles={[2]}>
                                    <CVAReports />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/cva/report/:id"
                            element={
                                <ProtectedRoute allowedRoles={[2]}>
                                    <ReportDetail />
                                </ProtectedRoute>
                            }
                        />

                        {/* ADMIN ROUTES */}
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={[3]}>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/transactions"
                            element={
                                <ProtectedRoute allowedRoles={[3]}>
                                    <Transactions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/wallets"
                            element={
                                <ProtectedRoute allowedRoles={[3]}>
                                    <Wallets />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/listings"
                            element={
                                <ProtectedRoute allowedRoles={[3]}>
                                    <Listings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <ProtectedRoute allowedRoles={[3]}>
                                    <AdminReports />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;

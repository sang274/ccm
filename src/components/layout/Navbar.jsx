import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Leaf, LogOut, User, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case UserRole.EvOwner:
        return 'EV Owner';
      case UserRole.Buyer:
        return 'Buyer';
      case UserRole.Cva:
        return 'CVA';
      case UserRole.Admin:
        return 'Admin';
      default:
        return 'User';
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.EvOwner:
        return '/ev-owner/dashboard';
      case UserRole.Buyer:
        return '/buyer/dashboard';
      case UserRole.Cva:
        return '/cva/dashboard';
      case UserRole.Admin:
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-700 to-teal-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? getDashboardPath() : '/'} className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors">
              <Leaf className="h-8 w-8" />
              <span className="text-xl font-bold">Carbon Credit Marketplace</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to={getDashboardPath()} className="text-white hover:text-emerald-100 transition-colors font-medium">
                  Dashboard
                </Link>
                {user.role === UserRole.EvOwner && (
                  <>
                    <Link to="/ev-owner/vehicles" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Xe của tôi
                    </Link>
                    <Link to="/ev-owner/trips" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Hành trình
                    </Link>
                    <Link to="/ev-owner/carbon-credits" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Tín chỉ Carbon
                    </Link>
                    <Link to="/ev-owner/wallet" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Ví
                    </Link>
                  </>
                )}
                {user.role === UserRole.Buyer && (
                  <>
                    <Link to="/buyer/marketplace" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Thị trường
                    </Link>
                    <Link to="/buyer/my-purchases" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Đã mua
                    </Link>
                    <Link to="/buyer/certificates" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Chứng nhận
                    </Link>
                  </>
                )}
                {user.role === UserRole.Cva && (
                  <>
                    <Link to="/cva/verifications" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Xác minh
                    </Link>
                    <Link to="/cva/reports" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Báo cáo
                    </Link>
                  </>
                )}
                {user.role === UserRole.Admin && (
                  <>
                    <Link to="/admin/users" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Người dùng
                    </Link>
                    <Link to="/admin/transactions" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Giao dịch
                    </Link>
                    <Link to="/admin/reports" className="text-white hover:text-emerald-100 transition-colors font-medium">
                      Báo cáo
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4 border-l border-emerald-500 pl-6">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.fullName || user.email}</span>
                      <span className="text-xs text-emerald-200">{getRoleLabel(user.role)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-white hover:text-emerald-100 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Đăng xuất</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-emerald-100 transition-colors font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-white text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-emerald-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-600">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user ? (
              <>
                <div className="py-3 border-b border-emerald-600">
                  <div className="text-white font-medium">{user.fullName || user.email}</div>
                  <div className="text-sm text-emerald-200">{getRoleLabel(user.role)}</div>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="block py-2 text-white hover:text-emerald-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-white hover:text-emerald-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-white hover:text-emerald-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-white hover:text-emerald-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

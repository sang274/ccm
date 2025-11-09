// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CHỈ 1 useEffect: Khởi tạo khi reload trang
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          // Nếu không có trong localStorage → gọi API
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Gọi authService.login → lưu token + user vào localStorage
      const response = await authService.login({ email, password });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      // 2. Lấy user từ localStorage (đã được lưu trong authService.login)
      const storedUser = authService.getStoredUser();
      if (!storedUser) {
        throw new Error('Không lấy được thông tin người dùng');
      }

      // 3. Cập nhật state
      setUser(storedUser);
      return storedUser;

    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
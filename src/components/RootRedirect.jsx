// src/components/RootRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RootRedirect = () => {
    const { user, loading } = useAuth();

    // 1. Đang tải → loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải ứng dụng...</p>
                </div>
            </div>
        );
    }

    // RootRedirect.jsx
    console.log('RootRedirect:', { user, loading });

    // 2. ĐÃ LOGIN → redirect theo role (BẢO VỆ user.role)
    if (user && typeof user.role === 'number') {
        const routes = {
            0: '/ev-owner/dashboard',
            1: '/buyer/dashboard',
            2: '/cva/dashboard',
            3: '/admin/dashboard',
        };
        const target = routes[user.role];
        if (target) {
            return <Navigate to={target} replace />;
        }
    }

    // 3. CHƯA LOGIN HOẶC role không hợp lệ → vào login
    return <Navigate to="/login" replace />;
};
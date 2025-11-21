// src/components/RootRedirect.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Home } from '../pages/Home';

export const RootRedirect = () => {
    const { user, loading } = useAuth();

    // 1. Đang tải → loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải ứng dụng...</p>
                </div>
            </div>
        );
    }

    // 2. ĐÃ LOGIN → redirect theo role
    if (user && typeof user.role === 'number') {
        const routes = {
            0: '/ev-owner/dashboard',
            1: '/buyer/dashboard',
            2: '/cva/dashboard',
            3: '/admin/dashboard',
        };
        const target = routes[user.role];
        if (target) {
            window.location.href = target;
            return null;
        }
    }

    // 3. CHƯA LOGIN → hiển thị Home page
    return <Home />;
};
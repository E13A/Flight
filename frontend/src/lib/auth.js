// Simple auth store using localStorage and React Context
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

// Auth context
const AuthContext = createContext(null);

// Helper functions for token management
export function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
}

export function setTokens(accessToken, refreshToken) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

export function getStoredUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
}

export function setStoredUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Auth API functions
export async function loginUser(username, password) {
    const response = await api.post('/auth/login', { username, password });
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);

    // Fetch user info
    const userResponse = await api.get('/auth/me');
    const user = userResponse.data;
    setStoredUser(user);

    return user;
}

export async function registerUser(data) {
    const response = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        phone: data.phone || null,
    });
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);

    // Fetch user info
    const userResponse = await api.get('/auth/me');
    const user = userResponse.data;
    setStoredUser(user);

    return user;
}

export async function logoutUser() {
    clearTokens();
}

export async function fetchCurrentUser() {
    try {
        const response = await api.get('/auth/me');
        const user = response.data;
        setStoredUser(user);
        return user;
    } catch (error) {
        clearTokens();
        return null;
    }
}

// Auth Provider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const token = getToken();
        if (token) {
            fetchCurrentUser()
                .then(user => {
                    setUser(user);
                })
                .catch(() => {
                    clearTokens();
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const user = await loginUser(username, password);
        setUser(user);
        return user;
    };

    const register = async (data) => {
        const user = await registerUser(data);
        setUser(user);
        return user;
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, Order, OrderStatus, CreateOrderRequest } from './types';

const API_BASE = 'http://localhost:8000/api';

const ENDPOINTS = {
    menuItems: `${API_BASE}/menu/`,
    orders: `${API_BASE}/orders/`,
    auth: {
        login: `${API_BASE}/auth/users/login/`,
        register: `${API_BASE}/auth/users/register/`,
        activation: `${API_BASE}/auth/users/activation/`,
        profile: `${API_BASE}/auth/users/profile/`,
        profileUpdate: `${API_BASE}/auth/users/profile/update/`,
        refresh: `${API_BASE}/auth/jwt/refresh/`,
    }
};

// Real API calls to Django backend
const apiCall = async (url: string, options: RequestInit = {}): Promise<any> => {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `JWT ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token might be expired, try refresh
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(ENDPOINTS.auth.refresh, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken }),
                });
                if (refreshResponse.ok) {
                    const { access } = await refreshResponse.json();
                    localStorage.setItem('access_token', access);
                    // Retry original request with new token
                    return apiCall(url, options);
                }
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
    }

    if (!response.ok) {
        const text = await response.text();
        let errorMessage = `API error: ${response.status} ${response.statusText}`;
        try {
            const errorData = JSON.parse(text);
            // Handle different error response formats
            if (errorData.email && Array.isArray(errorData.email)) {
                errorMessage = errorData.email[0]; // Get first email error
            } else if (errorData.error) {
                errorMessage = errorData.error;
            } else if (typeof errorData === 'object') {
                // Get first error message from any field
                for (const key in errorData) {
                    if (Array.isArray(errorData[key])) {
                        errorMessage = errorData[key][0];
                        break;
                    } else if (typeof errorData[key] === 'string') {
                        errorMessage = errorData[key];
                        break;
                    }
                }
            }
        } catch (e) {
            // If not JSON, use the text response
            if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

// React Query hooks
export const useMenuItems = (availableOnly = true) => useQuery({
    queryKey: ['menuItems', availableOnly],
    queryFn: async () => {
        const endpoint = availableOnly ? `${ENDPOINTS.menuItems}?available=true` : ENDPOINTS.menuItems;
        const response = await apiCall(endpoint);

        if (response && Array.isArray(response.results)) {
            return response.results;
        }

        return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000,
});

export const useCreateMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (menuItem: Partial<MenuItem>) => apiCall(ENDPOINTS.menuItems, {
            method: 'POST',
            body: JSON.stringify(menuItem),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        },
    });
};

export const useUpdateMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ menuItemId, data }: { menuItemId: number; data: Partial<MenuItem> }) => apiCall(`${ENDPOINTS.menuItems}${menuItemId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        },
    });
};

export const useDeleteMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (menuItemId: number) => apiCall(`${ENDPOINTS.menuItems}${menuItemId}/`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        },
    });
};

export const useToggleMenuItemAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ menuItemId, isAvailable }: { menuItemId: number; isAvailable: boolean }) => apiCall(`${ENDPOINTS.menuItems}${menuItemId}/toggle-availability/`, {
            method: 'PATCH',
            body: JSON.stringify({ is_available: isAvailable }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        },
    });
};

export const useOrders = () => useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
        const response = await apiCall(ENDPOINTS.orders);
        
        // Check if Django wrapped it in pagination
        if (response && Array.isArray(response.results)) {
            return response.results;
        }
        
        return Array.isArray(response) ? response : [];
    },
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
});

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrderRequest) => apiCall(ENDPOINTS.orders, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useUpdateStatus = (orderId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (status: OrderStatus) => apiCall(`${ENDPOINTS.orders}${orderId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

// Authentication functions
export const login = async (email: string, password: string) => {
    const response = await apiCall(ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (response.access && response.refresh) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
    }
    return response;
};

export const register = async (userData: any) => {
    return apiCall(ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const activateAccount = async (uid: string, token: string) => {
    return apiCall(ENDPOINTS.auth.activation, {
        method: 'POST',
        body: JSON.stringify({ uid, token }),
    });
};

export const getProfile = () => apiCall(ENDPOINTS.auth.profile);

export const updateProfile = (data: any) => apiCall(ENDPOINTS.auth.profileUpdate, {
    method: 'PUT',
    body: JSON.stringify(data),
});

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const getAuthToken = () => localStorage.getItem('access_token');
export const isAuthenticated = () => !!localStorage.getItem('access_token');


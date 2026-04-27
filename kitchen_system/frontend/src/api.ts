import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, Order, OrderStatus, CreateOrderRequest } from './types';

const API_BASE = 'http://localhost:8000/api';

const ENDPOINTS = {
    menuItems: `${API_BASE}/menu/`,
    orders: `${API_BASE}/orders/`,
};

// Real API calls to Django backend
const apiCall = async (url: string, options: RequestInit = {}): Promise<any> => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
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
export const useMenuItems = () => useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
        const response = await apiCall(ENDPOINTS.menuItems);
        
        // This is the magic fix! It tells React to look inside 'results'
        if (response && Array.isArray(response.results)) {
            return response.results;
        }
        
        // Fallback just in case pagination gets turned off later
        return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000, 
});

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


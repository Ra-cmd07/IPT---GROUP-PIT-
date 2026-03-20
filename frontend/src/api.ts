import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, Order, OrderStatus, CreateOrderRequest } from './types';

const API_BASE = 'http://localhost:8000/api';

const ENDPOINTS = {
    menuItems: `${API_BASE}/menu-items/`,
    orders: `${API_BASE}/orders/`,
};

// Mock data
const mockMenuItems: MenuItem[] = [
    { id: 1, name: 'Classic Burger', price: 249 },
    { id: 2, name: 'French Fries', price: 169 },
    { id: 3, name: 'Margherita Pizza', price: 819 },
    { id: 4, name: 'Caesar Salad', price: 199 },
    { id: 5, name: 'Coke', price: 50 },
];

let mockOrderId = 200;
const mockOrders: Order[] = [];

const TEN_MINS = 10 * 60 * 1000;

// Filter old completed orders
const getFilteredOrders = (): Order[] => mockOrders.filter(order => {
    if (order.status !== 'completed') return true;
    const completedAt = order.completedAt ? new Date(order.completedAt).getTime() : 0;
    return Date.now() - completedAt < TEN_MINS;
});

// Mock API with auto-delete
const mockApi = async (endpoint: string, options: RequestInit): Promise<any> => {
    await new Promise(r => setTimeout(r, 500));

    // Apply filter for all GET
    const filteredOrders = getFilteredOrders();

    if (endpoint.includes('menu-items')) {
        return mockMenuItems;
    }
    if (endpoint.includes('orders')) {
        if (options.method === 'GET') {
            return filteredOrders;
        }
        if (options.method === 'POST') {
            const data = JSON.parse(options.body as string) as CreateOrderRequest;
            const newOrder: Order = {
                id: mockOrderId++,
                items: data.items,
                status: 'pending' as OrderStatus,
                createdAt: new Date().toISOString(),
            };
            mockOrders.unshift(newOrder);
            return newOrder;
        }
        if (options.method === 'PATCH') {
            const id = parseInt(endpoint.split('/').filter(Boolean).pop() || '0');
            const data = JSON.parse(options.body as string);
            const order = mockOrders.find(o => o.id === id);
            if (order) {
                order.status = data.status as OrderStatus;
                if (data.status === 'completed') {
                    order.completedAt = new Date().toISOString();
                }
            }
            return { success: true };
        }
    }
    throw new Error('Endpoint not found');
};

// RTQ hooks
export const useMenuItems = () => useQuery({
    queryKey: ['menuItems'],
    queryFn: () => mockApi(ENDPOINTS.menuItems, { method: 'GET' }),
});

export const useOrders = () => useQuery({
    queryKey: ['orders'],
    queryFn: () => mockApi(ENDPOINTS.orders, { method: 'GET' }),
    refetchInterval: 2000,
});

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrderRequest) => mockApi(ENDPOINTS.orders, {
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
        mutationFn: (status: OrderStatus) => mockApi(`${ENDPOINTS.orders}${orderId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};


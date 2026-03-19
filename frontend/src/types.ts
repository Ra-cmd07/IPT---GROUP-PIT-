export interface MenuItem {
    id: number;
    name: string;
    price: number;
}

export interface OrderItem {
    id?: number;
    menuItemId: number;
    menuItem?: MenuItem;
    quantity: number;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed';

export interface Order {
    id: number;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: string;
    completedAt?: string;
}

export interface CreateOrderRequest {
    items: Array<{ menuItemId: number; quantity: number }>;
}


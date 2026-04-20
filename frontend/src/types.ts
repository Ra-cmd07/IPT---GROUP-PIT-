export interface MenuItem {
    id: number;
    name: string;
    price: number;
    category?: string;
    is_available?: boolean;
    estimated_prep_time?: number;
}

export interface OrderItem {
    id?: number;
    quantity: number;
    menu_item?: MenuItem;
    menu_item_id?: number;
    menu_item_name?: string;
    subtotal?: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
    id: number;
    items: OrderItem[];
    status: OrderStatus;
    table_number: number;
    created_at: string;
    completed_at?: string;
    total_price?: number;
}

export interface CreateOrderRequest {
    table_number?: number;
    items: Array<{ id: number; quantity: number }>;
    notes?: string;
}


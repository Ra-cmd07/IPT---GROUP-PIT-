import React, { useState, useCallback } from 'react';
import { useCreateOrder, useMenuItems } from '../api';
import MenuGrid from './MenuGrid';

interface OrderItem {
    menuItemId: number;
    quantity: number;
}

const OrderForm = () => {
    const createOrder = useCreateOrder();
    const { data: menuItems = [] } = useMenuItems();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [tableNumber, setTableNumber] = useState(1);

    const handleAddItem = useCallback((menuItemId: number, quantity: number) => {
        console.log('OrderForm add:', { menuItemId, quantity });
        setOrderItems(prev => {
            const existingIdx = prev.findIndex(i => i.menuItemId === menuItemId);
            if (existingIdx >= 0) {
                const newItems = [...prev];
                newItems[existingIdx] = { ...newItems[existingIdx], quantity: newItems[existingIdx].quantity + quantity };
                return newItems;
            }
            return [...prev, { menuItemId, quantity }];
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderItems.length === 0) return;
        
        // Convert menuItemId to id for backend
        const orderData = {
            table_number: tableNumber,
            items: orderItems.map(item => ({
                id: item.menuItemId,
                quantity: item.quantity
            }))
        };
        
        createOrder.mutate(orderData, {
            onSuccess: () => {
                alert('Order created successfully!');
                setOrderItems([]);
                setTableNumber(1);
            },
            onError: (error) => {
                alert('Error creating order: ' + error.message);
            }
        });
    };

    const removeItem = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = orderItems.reduce((sum: number, item) => {
        const menuItem = menuItems.find((m: any) => m.id === item.menuItemId);
        // ADDED Number()
        return sum + Number(menuItem?.price || 0) * item.quantity; 
    }, 0);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto animate-slide-up">
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-8">
                    📝 Create New Order
                </h2>
            </div>

            <MenuGrid onAddItem={handleAddItem} />

            {orderItems.length > 0 && (
                <div className="mt-16 animate-slide-up">
                    <div className="glass-card p-8 rounded-2xl mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-2xl font-bold text-white">Order Summary</h3>
                            <span className="badge bg-emerald-500/20 text-emerald-200 border-emerald-400/50">
                                {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
                            {orderItems.map((item, idx) => {
                                const menuItem = menuItems.find((m: any) => m.id === item.menuItemId);
                                const itemTotal = Number(menuItem?.price || 0) * item.quantity;
                                return (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-200 group"
                                    >
                                        <div className="flex-1">
                                            <div className="font-bold text-white text-lg">
                                                {menuItem?.name || `Item ${item.menuItemId}`}
                                            </div>
                                            <div className="text-sm text-gray-400 mt-1">
                                                {/* ADDED Number() and || 0 fallback */}
                                                ₱{Number(menuItem?.price || 0).toFixed(2)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-xl font-black text-emerald-400">
                                                ₱{itemTotal.toFixed(2)}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-all duration-200 font-medium text-sm border border-red-400/30"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-white/20 pt-6 flex justify-between items-center">
                            <div>
                                <div className="text-gray-400 text-sm mb-2">Total Amount</div>
                                <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                                    ₱{totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={createOrder.isPending || orderItems.length === 0}
                                className="btn-primary px-8 py-4 text-lg disabled:opacity-50"
                            >
                                {createOrder.isPending ? 'Creating...' : `Create Order (${totalItems} items)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderItems.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-lg">Select items from the menu above to create an order</p>
                </div>
            )}
        </form>
    );
};

export default OrderForm;


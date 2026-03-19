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

    const handleAddItem = useCallback((menuItemId: number, quantity: number) => {
        console.log('OrderForm add:', { menuItemId, quantity });
        // Check if item already exists, update qty instead of append
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
        createOrder.mutate({ items: orderItems }, {
            onSuccess: () => {
                alert('Order created successfully!');
            },
            onError: (error) => {
                alert('Error creating order: ' + error.message);
            }
        });
        setOrderItems([]);
    };

    const removeItem = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);

    return React.createElement('form', { onSubmit: handleSubmit, className: "glass-card p-12 rounded-3xl shadow-2xl border border-white/20 w-full max-w-6xl mx-auto min-h-screen" },
        React.createElement('h2', { className: "text-2xl font-bold mb-8 text-center bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent" },
            "Create New Order"
        ),
        React.createElement(MenuGrid, { onAddItem: handleAddItem }),
        orderItems.length > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: "mt-8" },
                React.createElement('h3', { className: "text-lg font-bold mb-4 text-gray-800" }, `Order Items (${orderItems.length})`),
                React.createElement('div', { className: "space-y-3 mb-8" },
                    orderItems.map((item, idx) =>
                        React.createElement('div', { key: idx, className: "flex justify-between items-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200/30" },
                            React.createElement('div', null, [
                                React.createElement('div', { className: "font-medium text-gray-900" },
                                    `${menuItems.find((m: any) => m.id === item.menuItemId)?.name || 'Item ' + item.menuItemId} (x${item.quantity})`
                                ),
                                React.createElement('div', { className: "text-emerald-600 font-bold" },
                                    '₱' + (menuItems.find((m: any) => m.id === item.menuItemId)?.price * item.quantity || 0).toFixed(2)
                                )
                            ]),
                            React.createElement('button', {
                                type: "button",
                                onClick: () => removeItem(idx),
                                className: "text-red-500 hover:text-red-600 font-medium text-sm"
                            }, "Remove")
                        )
                    )
                )
            ),
            React.createElement('button', {
                type: "submit",
                disabled: createOrder.isPending || orderItems.length === 0,
                className: "w-full py-4 px-8 rounded-2xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            },
                `Create Order (${totalItems} items - ₱${orderItems.reduce((sum: number, item) => {
                    const menuItem = menuItems.find((m: any) => m.id === item.menuItemId);
                    return sum + (menuItem?.price || 0) * item.quantity;
                }, 0).toFixed(2)})`
            )
        )
    );
};

export default OrderForm;


import React, { useState } from 'react';
import { useOrders } from '../api';
import OrderCard from './OrderCard';
import { Order, OrderStatus } from '../types';

const OrderQueue = () => {
    const { data: orders = [] } = useOrders();

    const [filter, setFilter] = useState<'all' | OrderStatus>('all');

    const filteredOrders = filter === 'all' ? orders : orders.filter((order: Order) => order.status === filter);

    const statusTabs = [
        { label: 'All', value: 'all' as const },
        { label: 'Pending', value: 'pending' as OrderStatus },
        { label: 'Cooking', value: 'cooking' as OrderStatus },
        { label: 'Ready', value: 'ready' as OrderStatus },
        { label: 'Completed', value: 'completed' as OrderStatus },
    ];

    const countForTab = (tabValue: 'all' | OrderStatus) => {
        return tabValue === 'all' ? orders.length : orders.filter((o: Order) => o.status === tabValue).length;
    };

    return React.createElement('div', { className: "glass-card p-8 rounded-3xl shadow-2xl border border-white/20" },
        React.createElement('div', { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4" },
            React.createElement('h2', { className: "text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" },
                "Kitchen Queue"
            ),
            React.createElement('div', { className: "flex flex-wrap gap-2" },
                statusTabs.map(tab =>
                    React.createElement('button', {
                        key: tab.value,
                        onClick: () => setFilter(tab.value),
                        className: `px-6 py-3 rounded-xl font-medium backdrop-blur-sm transition-all duration-300 ${filter === tab.value
                            ? 'bg-white/90 shadow-xl border-2 border-gray-200/50 hover:shadow-2xl hover:bg-white'
                            : 'bg-white/50 hover:bg-white/70 shadow-lg border border-white/30'
                            }`
                    },
                        `${tab.label} (${countForTab(tab.value)})`
                    )
                )
            )
        ),
        filteredOrders.length === 0
            ? React.createElement('div', { className: "text-center py-20" },
                React.createElement('div', { className: "text-6xl mb-4" }, "🍳"),
                React.createElement('h3', { className: "text-2xl font-bold text-gray-600 mb-2" }, `No orders ${filter !== 'all' ? `in ${filter} status` : ''}`),
                React.createElement('p', { className: "text-gray-500" }, "All caught up! Create a new order to get started.")
            )
            : React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
                filteredOrders.map((order: Order) =>
                    React.createElement(OrderCard, { key: order.id, order })
                )
            )
    );
};

export default OrderQueue;


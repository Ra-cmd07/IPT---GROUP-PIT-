import React, { useState } from 'react';
import { useOrders } from '../api';
import OrderCard from './OrderCard';
import { Order, OrderStatus } from '../types';

const OrderQueue = () => {
    const { data: orders = [] } = useOrders();
    const [filter, setFilter] = useState<'all' | OrderStatus>('all');

    const filteredOrders = filter === 'all' ? orders : orders.filter((order: Order) => order.status === filter);

    const statusTabs = [
        { label: 'All', value: 'all' as const, icon: '📊', color: 'from-blue-500 to-blue-600' },
        { label: 'Pending', value: 'pending' as OrderStatus, icon: '⏳', color: 'from-orange-500 to-orange-600' },
        { label: 'Preparing', value: 'preparing' as OrderStatus, icon: '🔥', color: 'from-red-500 to-red-600' },
        { label: 'Ready', value: 'ready' as OrderStatus, icon: '✅', color: 'from-emerald-500 to-emerald-600' },
        { label: 'Done', value: 'completed' as OrderStatus, icon: '🎉', color: 'from-purple-500 to-purple-600' },
    ];

    const countForTab = (tabValue: 'all' | OrderStatus) => {
        return tabValue === 'all' ? orders.length : orders.filter((o: Order) => o.status === tabValue).length;
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-slide-up">
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                    🔥 Kitchen Queue
                </h2>
                <p className="text-gray-400 text-lg">Real-time order management and status tracking</p>
            </div>

            {/* Status filter tabs */}
            <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
                {statusTabs.map(tab => {
                    const isActive = filter === tab.value;
                    const count = countForTab(tab.value);
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`
                                px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform
                                ${isActive
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-current/50 scale-105 border border-white/30`
                                    : 'glass-card border border-white/20 text-gray-200 hover:scale-105'
                                }
                            `}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                            <span className="ml-2 font-black">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Orders grid or empty state */}
            {filteredOrders.length === 0 ? (
                <div className="glass-card p-16 rounded-2xl text-center border border-white/20">
                    <div className="text-8xl mb-6 animate-bounce">🍳</div>
                    <h3 className="text-3xl font-black text-white mb-3">No Orders Found</h3>
                    <p className="text-xl text-gray-400">
                        {filter !== 'all'
                            ? `No orders in ${filter} status. Check other tabs!`
                            : 'All caught up! No orders yet. Create one to get started.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order: Order, index: number) => (
                        <div key={order.id} style={{
                            animation: `slide-up 0.5s ease-out ${index * 0.1}s both`
                        }}>
                            <OrderCard order={order} />
                        </div>
                    ))}
                </div>
            )}

            {/* Statistics footer */}
            {orders.length > 0 && (
                <div className="mt-12 glass-card p-6 rounded-xl border border-white/20">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4">
                            <div className="text-2xl font-black text-blue-400">{orders.length}</div>
                            <div className="text-sm text-gray-400">Total</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-2xl font-black text-orange-400">{orders.filter(o => o.status === 'pending').length}</div>
                            <div className="text-sm text-gray-400">Pending</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-2xl font-black text-red-400">{orders.filter(o => o.status === 'preparing').length}</div>
                            <div className="text-sm text-gray-400">Preparing</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-2xl font-black text-emerald-400">{orders.filter(o => o.status === 'ready').length}</div>
                            <div className="text-sm text-gray-400">Ready</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-2xl font-black text-purple-400">{orders.filter(o => o.status === 'completed').length}</div>
                            <div className="text-sm text-gray-400">Done</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderQueue;


import React from 'react';
import { Order, OrderStatus, OrderItem } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useUpdateStatus } from '../api';

interface Props {
    order: Order;
}

const statusConfig: Record<OrderStatus, { icon: string; gradient: string; bgGradient: string; textColor: string }> = {
    pending: { icon: '⏳', gradient: 'from-orange-400 to-orange-600', bgGradient: 'from-orange-500/20 to-orange-600/10', textColor: 'text-orange-300' },
    preparing: { icon: '🔥', gradient: 'from-red-400 to-red-600', bgGradient: 'from-red-500/20 to-red-600/10', textColor: 'text-red-300' },
    ready: { icon: '✅', gradient: 'from-emerald-400 to-emerald-600', bgGradient: 'from-emerald-500/20 to-emerald-600/10', textColor: 'text-emerald-300' },
    completed: { icon: '🎉', gradient: 'from-purple-400 to-purple-600', bgGradient: 'from-purple-500/20 to-purple-600/10', textColor: 'text-purple-300' },
    cancelled: { icon: '❌', gradient: 'from-gray-400 to-gray-600', bgGradient: 'from-gray-500/20 to-gray-600/10', textColor: 'text-gray-300' },
};

const OrderCard: React.FC<Props> = ({ order }) => {
    const updateStatus = useUpdateStatus(order.id);
    const config = statusConfig[order.status] || statusConfig.pending;

    const totalItems = order.items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
    const completionTime = order.completed_at ? formatDistanceToNow(new Date(order.completed_at), { addSuffix: true }) : null;

    const getNextStatus = (current: OrderStatus): OrderStatus => {
        const statuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];
        const idx = statuses.indexOf(current);
        return idx < statuses.length - 1 ? statuses[idx + 1]! : current;
    };

    const handleUpdate = () => {
        if (order.status !== 'completed') {
            updateStatus.mutate(getNextStatus(order.status));
        }
    };

    return (
        <div className={`glass-card p-6 rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-white/10`}>
            {/* Background gradient accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.bgGradient} rounded-full blur-3xl opacity-50 hover:opacity-70 transition-opacity`}></div>

            <div className="relative z-10">
                {/* Header with order ID, table number and status badge */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-black text-white">
                            Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Table {order.table_number}</p>
                    </div>
                    <span className={`badge px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold text-sm border border-white/30 shadow-lg`}>
                        <span className="mr-2">{config.icon}</span>
                        {order.status.toUpperCase()}
                    </span>
                </div>

                {/* Items list */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">{item.menu_item_name || `Item ${item.id}`}</span>
                                <span className={`font-bold ${config.textColor}`}>×{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/20 mt-3 pt-3 flex justify-between items-center font-bold">
                        <span className="text-gray-300">Total Items:</span>
                        <span className="text-white text-lg">{totalItems}</span>
                    </div>
                </div>

                {/* Timestamps and total price */}
                <div className="text-xs text-gray-500 space-y-1 mb-4 bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>Created: {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                        </div>
                    </div>
                    {completionTime && (
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Done: {completionTime}</span>
                        </div>
                    )}
                    {order.total_price && (
                        <div className="flex items-center justify-between text-white font-bold mt-2">
                            <span>Total Price:</span>
                            {/* ADDED Number() HERE: */}
                            <span className="text-emerald-400">₱{Number(order.total_price).toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {/* Action button */}
                <button
                    onClick={handleUpdate}
                    disabled={updateStatus.isPending || order.status === 'completed'}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed
                        ${order.status === 'completed'
                            ? 'bg-gray-500 cursor-default'
                            : `bg-gradient-to-r ${config.gradient} hover:shadow-lg hover:shadow-current/50 hover:scale-[1.02] active:scale-[0.98]`
                        }
                    `}
                >
                    {updateStatus.isPending ? 'Updating...' : order.status === 'completed' ? 'Order Complete' : `Mark as ${getNextStatus(order.status).toUpperCase()}`}
                </button>
            </div>
        </div>
    );
};

export default OrderCard;


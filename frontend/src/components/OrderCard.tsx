import React from 'react';
import { Order, OrderStatus, OrderItem } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useUpdateStatus } from '../api';

interface Props {
    order: Order;
}

const statusColors: Record<OrderStatus, string> = {
    pending: 'from-orange-400 to-orange-600',
    cooking: 'from-blue-400 to-blue-600',
    ready: 'from-green-400 to-green-600',
    completed: 'from-gray-400 to-gray-600',
};

const mockMenuItems: { id: number, name: string, price: number }[] = [

];

const OrderCard: React.FC<Props> = ({ order }) => {
    const updateStatus = useUpdateStatus(order.id);

    const totalItems = order.items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
    const completionTime = order.completedAt ? formatDistanceToNow(new Date(order.completedAt), { addSuffix: true }) : null;

    const getNextStatus = (current: OrderStatus): OrderStatus => {
        const statuses: OrderStatus[] = ['pending', 'cooking', 'ready', 'completed'];
        const idx = statuses.indexOf(current);
        return idx < statuses.length - 1 ? statuses[idx + 1]! : current;
    };

    const handleUpdate = () => {
        updateStatus.mutate(getNextStatus(order.status));
    };

    return React.createElement('div', { className: "glass-card p-6 rounded-2xl shadow-2xl border border-white/20 min-w-[300px] max-w-sm" },
        React.createElement('div', { className: "flex justify-between items-start mb-4" },
            React.createElement('h3', { className: "text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent" },
                `Order #${order.id}`
            ),
            React.createElement('span', { className: `px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-gradient-to-r ${statusColors[order.status]} text-white shadow-lg` },
                order.status.toUpperCase()
            )
        ),
        React.createElement('div', { className: "space-y-2 mb-4" },
            order.items.map((item, index) =>
                React.createElement('div', { key: item.menuItemId + '-' + index, className: "flex justify-between text-sm" },
                    React.createElement('span', null, mockMenuItems.find(m => m.id === item.menuItemId)?.name || `Item ${item.menuItemId}`),
                    React.createElement('span', { className: "font-semibold" }, `x${item.quantity}`)
                )
            ),
            React.createElement('div', { className: "pt-2 border-t border-white/10 flex justify-between" },
                React.createElement('span', null, "Total items:"),
                React.createElement('span', { className: "font-bold" }, totalItems.toString())
            )
        ),
        React.createElement('div', { className: "text-xs text-gray-400 mb-4 space-y-1" },
            React.createElement('div', null, `Created: ${formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}`),
            completionTime && React.createElement('div', null, `Completed: ${completionTime}`)
        ),
        React.createElement('button', {
            onClick: handleUpdate,
            disabled: updateStatus.isPending,
            className: "w-full glass-button py-3 px-4 rounded-xl font-medium text-gray-800 backdrop-blur-sm bg-white/70 hover:bg-white/90 shadow-xl border border-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        }, updateStatus.isPending ? 'Updating...' : `Mark as ${getNextStatus(order.status).toUpperCase()}`)
    );
};

export default OrderCard;


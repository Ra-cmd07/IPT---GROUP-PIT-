import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useMenuItems } from '../api';

interface Props {
    onAddItem: (menuItemId: number, quantity: number) => void;
}

const ItemSelector: React.FC<Props> = ({ onAddItem }) => {
    const { data: menuItems = [] } = useMenuItems();
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState(1);

    const selectedItem = (menuItems as MenuItem[]).find(item => item.id === selectedId) as MenuItem | undefined;

    const handleAdd = () => {
        if (selectedId && quantity > 0) {
            onAddItem(selectedId, quantity);
            setQuantity(1);
            setSelectedId('');
        }
    };

    return React.createElement('div', { className: "glass-card p-6 rounded-2xl shadow-2xl border border-white/20" },
        React.createElement('h4', { className: "text-lg font-bold mb-4 text-gray-800" }, "Add Item"),
        React.createElement('div', { className: "space-y-4" },
            React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Menu Item"),
                React.createElement('select', {
                    value: selectedId,
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedId(Number(e.target.value) || ''),
                    className: "w-full p-3 rounded-xl border border-gray-200/50 backdrop-blur-sm bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                },
                    React.createElement('option', { value: "" }, "Select item..."),
                    (menuItems as MenuItem[]).map((item: MenuItem) =>
                        React.createElement('option', { key: item.id, value: item.id.toString() },
                            `${item.name} - $${item.price.toFixed(2)}`
                        )
                    )
                )
            ),
            React.createElement('div', null,
                React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Quantity"),
                React.createElement('input', {
                    type: "number",
                    min: "1",
                    value: quantity,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value) || 1),
                    className: "w-full p-3 rounded-xl border border-gray-200/50 backdrop-blur-sm bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                })
            ),
            selectedItem && React.createElement('div', { className: "p-3 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200/30 text-sm" },
                React.createElement('span', null, "Selected: "),
                React.createElement('strong', null, selectedItem.name),
                React.createElement('span', null, ` x${quantity} = $${(selectedItem.price * quantity).toFixed(2)}`)
            ),
            React.createElement('button', {
                onClick: handleAdd,
                disabled: !selectedId || quantity < 1,
                className: "w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
            },
                "Add to Order"
            )
        )
    );
};

export default ItemSelector;


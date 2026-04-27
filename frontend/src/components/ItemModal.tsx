import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../types';

interface Props {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (menuItemId: number, quantity: number) => void;
}

const ItemModal: React.FC<Props> = ({ item, isOpen, onClose, onAdd }) => {
    const [quantity, setQuantity] = useState(1);

    const handleMinus = useCallback(() => {
        setQuantity(prev => Math.max(1, prev - 1));
    }, []);

    const handlePlus = useCallback(() => {
        setQuantity(prev => prev + 1);
    }, []);

    const handleAddClick = useCallback(() => {
        if (item) onAdd(item.id, quantity);
        onClose();
    }, [item, quantity, onAdd, onClose]);

    useEffect(() => {
        setQuantity(1);
    }, [isOpen]);

    if (!isOpen || !item) return null;

    const imageUrls: Record<number, string> = {
        // 1: Caesar Salad
        1: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        // 2: Tomato Soup
        2: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
        // 3: Grilled Chicken
        3: 'https://images.unsplash.com/photo-1592011432621-f7f576f44484?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        // 4: Beef Burger
        4: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        // 5: Margherita Pizza
        5: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        // 6: Chocolate Lava Cake
        6: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
        // 7: Lemonade
        7: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        // 8: Coffee
        8: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop',
    };

    const totalPrice = (Number(item.price) * quantity).toFixed(2);

    return (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-2xl rounded-3xl p-0 w-full max-w-md shadow-2xl border border-white/20 flex flex-col relative overflow-hidden transform transition-all duration-300 animate-scale-in" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    className="absolute top-6 right-6 z-20 w-12 h-12 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
                    onClick={onClose}
                    type="button"
                >
                    ✕
                </button>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 pt-12 space-y-6">
                    {/* Image */}
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/20">
                        <img
                            src={imageUrls[item.id as number] || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                    </div>

                    {/* Name */}
                    <h2 className="text-3xl font-black text-white text-center leading-tight px-4">
                        {item.name}
                    </h2>

                    {/* Price */}
                    <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                        ₱{Number(item.price).toFixed(2)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-sm w-full">
                        <button
                            type="button"
                            onClick={handleMinus}
                            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl flex items-center justify-center text-3xl font-black shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border border-red-400/30"
                        >
                            −
                        </button>

                        <div className="flex-1 text-center">
                            <div className="text-5xl font-black text-white drop-shadow-lg">
                                {quantity}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">items</div>
                        </div>

                        <button
                            type="button"
                            onClick={handlePlus}
                            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center text-3xl font-black shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border border-emerald-400/30"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Bottom Action Button */}
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-t border-white/20 p-6 space-y-3">
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 border border-emerald-400/30"
                    >
                        <span className="text-2xl">🛒</span>
                        <span>Add {quantity} item{quantity !== 1 ? 's' : ''} - ₱{totalPrice}</span>
                    </button>
                    <p className="text-xs text-gray-400 text-center">Click outside or close to cancel</p>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;


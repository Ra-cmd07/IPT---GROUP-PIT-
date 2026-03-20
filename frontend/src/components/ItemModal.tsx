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
        console.log('− clicked');
        setQuantity(prev => Math.max(1, prev - 1));
    }, []);

    const handlePlus = useCallback(() => {
        console.log('+ clicked');
        setQuantity(prev => prev + 1);
    }, []);

    const handleAddClick = useCallback(() => {
        console.log('ItemModal ADD clicked! Item ID:', item?.id, 'Qty:', quantity);
        if (item) onAdd(item.id, 1);
        onClose();
    }, [item, onAdd, onClose]);

    useEffect(() => {
        setQuantity(1);
    }, [isOpen]);

    if (!isOpen || !item) return null;

    const imageUrls = {
        1: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        2: 'https://images.unsplash.com/photo-1608219994488-cc269412b3e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        3: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        4: 'https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        5: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    };

    const totalPrice = (item.price * quantity).toFixed(2);

    return (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 w-full max-w-md max-h-[90vh] shadow-2xl border border-white/50 flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 z-20 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl hover:shadow-white/20 transition-all"
                    onClick={onClose}
                    type="button"
                >
                    ×
                </button>

                {/* Main Content - Fixed layout */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 pt-20 space-y-6">
                    {/* Image - Fixed size */}
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                        <img
                            src={imageUrls[item.id as number] || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name - Fixed position */}
                    <h3 className="text-2xl font-black text-gray-900 text-center leading-tight px-4">
                        {item.name}
                    </h3>

                    {/* Price - Fixed position */}
                    <div className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-2xl">
                        ₱{item.price.toFixed(2)}
                    </div>

                    {/* Quantity Controls - Fixed center */}
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl shadow-xl backdrop-blur-sm border border-gray-200/50">
                        <button
                            type="button"
                            onClick={handleMinus}
                            className="w-16 h-16 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95 border border-gray-200"
                        >
                            −
                        </button>

                        <div className="text-4xl font-black text-gray-900 bg-white px-8 py-4 rounded-3xl shadow-2xl border-4 border-gray-300 min-w-[6rem] text-center">
                            {quantity}
                        </div>

                        <button
                            type="button"
                            onClick={handlePlus}
                            className="w-16 h-16 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95 border border-gray-200"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Fixed Bottom Add Button */}
                <div className="bg-white/90 backdrop-blur-sm border-t-2 border-gray-200 p-4 px-6">
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="w-full h-16 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 border border-emerald-400/30"
                    >
                        <span className="text-2xl">🛒</span>
                        Add {quantity} to Order
                        <span className="text-lg font-bold ml-auto">${totalPrice}</span>
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">Tap outside to close</p>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;


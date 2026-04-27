import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useMenuItems } from '../api';
import ItemModal from './ItemModal';

interface Props {
    onAddItem: (menuItemId: number, quantity: number) => void;
}

const MenuGrid: React.FC<Props> = ({ onAddItem }) => {
    const { data: menuItems = [] } = useMenuItems();
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const menuImages: Record<number, string> = {
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
        
    const openModal = (item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddFromModal = (itemId: number, quantity: number) => {
        onAddItem(itemId, quantity);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <>
            <div className="mb-8 pointer-events-auto select-none">
                <h3 className="text-2xl font-bold text-gray-300 mb-6">Select Items</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-max">
                    {menuItems.map((item: MenuItem) => (
                        <div
                            key={item.id}
                            onClick={() => openModal(item)}
                            // Removed the undefined animate-slide-up class that was likely keeping opacity at 0
                            className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform hover:-translate-y-2"
                        >
                            {/* Image container */}
                            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                                <img
                                    src={menuImages[item.id as keyof typeof menuImages] || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover hover:scale-125 transition-transform duration-500 brightness-75 hover:brightness-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent hover:from-black/60 transition-all duration-300"></div>

                                {/* Content overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pb-4 text-center z-10">
                                    {/* Small preview image */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-xl mb-3 border-2 border-white/30 hover:border-white/60 transition-colors">
                                        <img
                                            src={menuImages[item.id as keyof typeof menuImages] || '/placeholder.jpg'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Name */}
                                    <h4 className="font-black text-base text-white drop-shadow-lg leading-tight line-clamp-2 px-2 hover:scale-105 transition-transform">
                                        {item.name}
                                    </h4>

                                    {/* Price badge */}
                                    <div className="mt-3 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-black text-sm shadow-lg drop-shadow-lg hover:scale-110 transition-transform">
                                        ₱{Number(item.price).toFixed(2)}
                                    </div>
                                </div>

                                {/* Click indicator */}
                                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg hover:bg-white/40 hover:scale-110 transition-all">
                                    👆
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ItemModal
                item={selectedItem}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                onAdd={handleAddFromModal}
            />
        </>
    );
};

export default MenuGrid;
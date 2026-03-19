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

    const modalImages: Record<number, string> = {
        1: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        2: 'https://images.unsplash.com/photo-1608219994488-cc269412b3e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        3: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        4: 'https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        5: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    };

    const menuImages: Record<number, string> = modalImages;

    const openModal = (item: MenuItem) => {
        console.log('Opening modal for:', item.name);
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddFromModal = (itemId: number, quantity: number) => {
        console.log('MenuGrid handleAddFromModal called with:', { itemId, quantity });
        onAddItem(itemId, quantity);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    console.log('Menu items loaded:', menuItems.length);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 pointer-events-auto select-none auto-rows-fr">
                {menuItems.map((item: MenuItem) => (
                    <div
                        key={item.id}
                        className="group cursor-pointer h-72 w-full flex flex-col shadow-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-3xl hover:z-10 flex-1 relative"
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => openModal(item)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20" />
                        <img
                            src={menuImages[item.id as keyof typeof menuImages] || '/placeholder.jpg'}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
                        />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-4/5 space-y-2 z-10">
                            <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden shadow-2xl bg-white/90">
                                <img
                                    src={menuImages[item.id as keyof typeof menuImages] || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h4 className="font-black text-lg text-white drop-shadow-2xl leading-tight line-clamp-2 bg-black/40 py-1 px-3 rounded-lg">
                                {item.name}
                            </h4>
                            <div className="text-2xl font-black text-emerald-300 drop-shadow-2xl bg-black/50 px-4 py-2 rounded-xl">
                                ₱{item.price.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
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


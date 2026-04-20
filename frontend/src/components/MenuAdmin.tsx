import React, { useMemo, useState } from 'react';
import { MenuItem } from '../types';
import {
    useMenuItems,
    useCreateMenuItem,
    useUpdateMenuItem,
    useDeleteMenuItem,
    useToggleMenuItemAvailability,
} from '../api';

const categories = ['starter', 'main', 'dessert', 'drink'];

const MenuAdmin: React.FC = () => {
    const { data: menuItems = [], isLoading, isError } = useMenuItems(false);
    const createMenuItem = useCreateMenuItem();
    const [editedId, setEditedId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<MenuItem>>({
        name: '',
        category: 'starter',
        price: 0,
        estimated_prep_time: 10,
        is_available: true,
    });

    const updateMenuItem = useUpdateMenuItem();
    const deleteMenuItem = useDeleteMenuItem();
    const toggleAvailability = useToggleMenuItemAvailability();

    const startEdit = (item: MenuItem) => {
        setEditedId(item.id);
        setFormData({
            name: item.name,
            category: item.category,
            price: Number(item.price),
            estimated_prep_time: Number(item.estimated_prep_time),
            is_available: item.is_available,
        });
    };

    const cancelEdit = () => {
        setEditedId(null);
        setFormData({ name: '', category: 'starter', price: 0, estimated_prep_time: 10, is_available: true });
    };

    const saveEdit = async () => {
        if (!editedId) return;
        await updateMenuItem.mutateAsync({ menuItemId: editedId, data: formData });
        cancelEdit();
    };

    const createItem = async (event: React.FormEvent) => {
        event.preventDefault();
        await createMenuItem.mutateAsync(formData);
        setFormData({ name: '', category: 'starter', price: 0, estimated_prep_time: 10, is_available: true });
    };

    const handleDelete = async (itemId: number) => {
        await deleteMenuItem.mutateAsync(itemId);
    };

    const handleToggleAvailability = async (item: MenuItem) => {
        await toggleAvailability.mutateAsync({ menuItemId: item.id, isAvailable: !item.is_available });
    };

    if (isLoading) return <div className="text-white">Loading menu...</div>;
    if (isError) return <div className="text-red-400">Failed to load menu.</div>;

    return (
        <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Menu Editor</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item: MenuItem) => (
                    <div key={item.id} className="bg-slate-900/60 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            <span className={`text-xs rounded px-2 py-1 font-semibold ${item.is_available ? 'bg-green-500/60' : 'bg-red-500/60'}`}>
                                {item.is_available ? 'Available' : 'Hidden'}
                            </span>
                        </div>
                        <p>Category: {item.category}</p>
                        <p>Price: ₱{Number(item.price).toFixed(2)}</p>
                        <p>Prep: {item.estimated_prep_time} min</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                onClick={() => startEdit(item)}
                                className="px-2 py-1 rounded bg-blue-500/90 hover:bg-blue-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleToggleAvailability(item)}
                                className="px-2 py-1 rounded bg-amber-500/90 hover:bg-amber-500"
                            >
                                {item.is_available ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="px-2 py-1 rounded bg-red-500/90 hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-slate-800/70 rounded-lg border border-white/10">
                <h3 className="text-xl font-bold mb-3">{editedId ? 'Edit Item' : 'Add New Item'}</h3>
                <form onSubmit={createItem} className="grid gap-3 sm:grid-cols-2">
                    <input
                        className="p-2 rounded bg-slate-700 border border-white/20"
                        placeholder="Name"
                        value={formData.name ?? ''}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                    <select
                        className="p-2 rounded bg-slate-700 border border-white/20"
                        value={formData.category ?? 'starter'}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="p-2 rounded bg-slate-700 border border-white/20"
                        placeholder="Price"
                        value={formData.price ?? 0}
                        onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        min={0}
                        step={0.01}
                        required
                    />
                    <input
                        type="number"
                        className="p-2 rounded bg-slate-700 border border-white/20"
                        placeholder="Estimated prep time"
                        value={formData.estimated_prep_time ?? 10}
                        onChange={e => setFormData(prev => ({ ...prev, estimated_prep_time: Number(e.target.value) }))}
                        min={1}
                        required
                    />
                    <label className="text-sm flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!formData.is_available}
                            onChange={e => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                        />
                        Available
                    </label>

                    <div className="flex items-center gap-2 sm:col-span-2">
                        {editedId ? (
                            <>
                                <button
                                    type="button"
                                    onClick={saveEdit}
                                    className="px-3 py-2 bg-emerald-500 rounded hover:bg-emerald-400"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-3 py-2 bg-slate-600 rounded hover:bg-slate-500"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="submit"
                                className="px-3 py-2 bg-indigo-500 rounded hover:bg-indigo-400"
                                disabled={createMenuItem.status === 'pending'}
                            >
                                Create Menu Item
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuAdmin;

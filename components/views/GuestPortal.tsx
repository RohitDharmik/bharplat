import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { QrCode, ArrowRight, ShoppingBag, Plus, Minus, Trash2, CreditCard, CheckCircle, Clock, Utensils } from 'lucide-react';
import { OrderItem, MenuItem, OrderStatus, Table } from '../../types';
import { Modal, message, Button, Input } from 'antd';

// Component 1: Mock QR Scan / Table Selection
export const GuestTableSelection: React.FC = () => {
    const { tables, setGuestTableId } = useAppStore();
    const [scanning, setScanning] = useState(false);

    const handleTableSelect = (tableId: string) => {
        setScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            setGuestTableId(tableId);
            setScanning(false);
        }, 800);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute -inset-4 bg-gold-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10">
                    <QrCode size={80} className="text-gold-600 dark:text-gold-500" />
                </div>
            </div>
            
            <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome to Luxe</h2>
                <p className="text-neutral-500 dark:text-neutral-400">Scan the QR code on your table or select your table number below to view the menu.</p>
            </div>

            {scanning ? (
                <div className="flex flex-col items-center gap-3 text-gold-500">
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting to table...</span>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-lg px-4">
                    {tables.map(table => (
                        <button
                            key={table.id}
                            onClick={() => handleTableSelect(table.id)}
                            className="p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-gold-500 hover:text-gold-500 dark:hover:text-gold-400 transition-all font-medium text-neutral-700 dark:text-neutral-300 shadow-sm"
                        >
                            {table.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Component 2: Guest Menu & Ordering
export const GuestMenu: React.FC = () => {
    const { menu, placeOrder, guestTableId, tables } = useAppStore();
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const categories = ['All', 'Starter', 'Main', 'Dessert', 'Drink'];
    const filteredMenu = activeCategory === 'All' ? menu : menu.filter(m => m.category === activeCategory);
    const table = tables.find(t => t.id === guestTableId);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.menuItemId === item.id);
            if (existing) {
                messageApi.info(`Added another ${item.name}`);
                return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            messageApi.success(`Added ${item.name} to order`);
            return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
        });
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.menuItemId === itemId) return { ...i, quantity: Math.max(1, i.quantity + delta) };
            return i;
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.menuItemId !== itemId));
    };

    const handlePlaceOrder = async () => {
        if (!guestTableId || cart.length === 0) return;
        await placeOrder(guestTableId, cart);
        setCart([]);
        setIsCartOpen(false);
        Modal.success({
            title: 'Order Placed!',
            content: 'Your order has been sent to the kitchen. You can track it in "My Bill".',
            centered: true,
            okButtonProps: { className: 'bg-gold-500 text-black border-none hover:bg-gold-400' }
        });
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="pb-20">
            {contextHolder}
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Menu</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">{table?.name}</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2 sticky top-0 bg-white dark:bg-[#0a0a0a] z-10 pt-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                            activeCategory === cat 
                            ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' 
                            : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-transparent dark:border-white/10'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenu.map(item => (
                    <div key={item.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 p-3 rounded-2xl flex gap-4 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-neutral-100" />
                        <div className="flex flex-col justify-between flex-1 py-1">
                            <div>
                                <h3 className="font-bold text-neutral-900 dark:text-white line-clamp-1">{item.name}</h3>
                                <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-bold text-gold-600 dark:text-gold-500">₹{item.price}</span>
                                <button 
                                    onClick={() => addToCart(item)}
                                    className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-gold-500 dark:hover:bg-gold-500 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-40">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black p-4 rounded-2xl shadow-2xl flex justify-between items-center font-bold text-lg animate-in slide-in-from-bottom-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-gold-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {cart.reduce((a, b) => a + b.quantity, 0)}
                            </div>
                            <span>View Order</span>
                        </div>
                        <span>₹{total.toFixed(2)}</span>
                    </button>
                </div>
            )}

            <Modal
                title={<span className="text-xl font-bold">Your Selection</span>}
                open={isCartOpen}
                onCancel={() => setIsCartOpen(false)}
                footer={null}
                centered
                width={500}
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.menuItemId} className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-white/5">
                            <div>
                                <h4 className="font-bold dark:text-white">{item.name}</h4>
                                <p className="text-sm text-gold-600">₹{item.price * item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.menuItemId, -1)} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded"><Minus size={14} /></button>
                                <span className="w-6 text-center text-sm font-bold dark:text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.menuItemId, 1)} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded"><Plus size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/10">
                    <div className="flex justify-between text-xl font-bold mb-6 dark:text-white">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handlePlaceOrder}
                        className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-gold-500/20"
                    >
                        Place Order <ArrowRight size={20} />
                    </button>
                </div>
            </Modal>
        </div>
    );
};

// Component 3: Guest Bill & Status
export const GuestBill: React.FC = () => {
    const { orders, guestTableId, updateOrderStatus, tables } = useAppStore();
    const [messageApi, contextHolder] = message.useMessage();

    const activeOrders = orders.filter(o => o.tableId === guestTableId && o.status !== OrderStatus.PAID);
    const table = tables.find(t => t.id === guestTableId);

    // Calculate totals
    const grandTotal = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const handlePay = async () => {
        // Simulate payment process
        messageApi.loading('Processing payment...', 1.5)
            .then(() => {
                activeOrders.forEach(o => updateOrderStatus(o.id, OrderStatus.PAID));
                Modal.success({
                    title: 'Payment Successful',
                    content: 'Thank you for dining with us! We hope to see you again soon.',
                    centered: true,
                    okButtonProps: { className: 'bg-gold-500 text-black border-none' }
                });
            });
    };

    if (activeOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400">
                    <Utensils size={40} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">No Active Orders</h3>
                <p className="text-neutral-500 dark:text-neutral-400">You haven't ordered anything yet, or your bill is fully paid.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            {contextHolder}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Bill</h2>
                <p className="text-neutral-500 dark:text-neutral-400">{table?.name}</p>
            </div>

            <div className="space-y-4">
                {activeOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3 border-b border-neutral-100 dark:border-white/5 pb-3">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    order.status === OrderStatus.SERVED ? 'bg-blue-500' :
                                    order.status === OrderStatus.READY ? 'bg-green-500' :
                                    'bg-yellow-500'
                                }`}></span>
                                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 uppercase">{order.status}</span>
                            </div>
                            <span className="text-xs text-neutral-400">#{order.id.slice(-4)}</span>
                        </div>
                        
                        <div className="space-y-2">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <div className="flex gap-2 text-neutral-800 dark:text-neutral-200">
                                        <span className="font-bold">{item.quantity}x</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="text-neutral-500">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-2 text-neutral-400 dark:text-neutral-500 text-sm">
                    <span>Subtotal</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-neutral-400 dark:text-neutral-500 text-sm">
                    <span>Tax & Service</span>
                    <span>₹{(grandTotal * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-3xl font-bold mb-8">
                    <span>Total</span>
                    <span>₹{(grandTotal * 1.15).toFixed(2)}</span>
                </div>

                <button 
                    onClick={handlePay}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors"
                >
                    <CreditCard size={20} />
                    Pay Bill Now
                </button>
                <div className="mt-4 text-center">
                     <p className="text-xs text-neutral-500">Secure payment powered by Stripe</p>
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { QrCode, ArrowRight, ShoppingBag, Plus, Minus, Trash2, CreditCard, CheckCircle, Clock, Utensils, Soup, Pizza, Cake, Wine, Coffee } from 'lucide-react';
import { OrderItem, MenuItem, OrderStatus, Table } from '../../types';
import { Modal, message, Button, Input, Collapse } from 'antd';

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
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome to bharplate</h2>
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
    const { Panel } = Collapse;

    const categories = ['All', 'Starter', 'Main', 'Dessert', 'Drink'];
    const table = tables.find(t => t.id === guestTableId);

    // Category icons mapping
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Starter': return Soup;
            case 'Main': return Pizza;
            case 'Dessert': return Cake;
            case 'Drink': return Wine;
            default: return Utensils;
        }
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
    };

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
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2 sticky top-0 bg-white dark:bg-[#0a0a0a] z-20 pt-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                            activeCategory === cat
                            ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20 ring-2 ring-gold-300/50'
                            : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-transparent dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Accordion */}
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <Collapse
                    accordion
                    defaultActiveKey={categories[1]} // Open first category by default (Starter)
                    activeKey={activeCategory === 'All' ? categories[1] : activeCategory}
                    onChange={(key) => {
                        if (Array.isArray(key) && key.length > 0) {
                            setActiveCategory(key[0]);
                        } else {
                            setActiveCategory(categories[1]);
                        }
                    }}
                    className="bg-transparent border-none"
                    expandIcon={() => null} // Hide the expand icon
                    ghost // Remove default panel styling
                >
                    {categories.filter(cat => cat !== 'All').map(category => {
                        const categoryItems = menu.filter(item => item.category === category);
                        
                        if (categoryItems.length === 0) return null;

                        return (
                            <Panel
                                key={category}
                                header={
                                    <div className="flex items-center gap-4 p-2">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/30 dark:to-gold-800/30 flex items-center justify-center transition-all duration-300 ${
                                            activeCategory === category
                                                ? 'scale-110 shadow-lg shadow-gold-500/30 ring-2 ring-gold-400/50'
                                                : 'shadow-md'
                                        }`}>
                                            {React.createElement(getCategoryIcon(category), {
                                                size: 24,
                                                className: `transition-all duration-300 ${
                                                    activeCategory === category
                                                        ? 'text-gold-700 scale-110'
                                                        : 'text-gold-600'
                                                }`
                                            })}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h3 className={`text-xl font-bold transition-all duration-300 ${
                                                activeCategory === category ? 'text-gold-600 dark:text-gold-500 scale-105' : 'text-neutral-900 dark:text-white'
                                            }`}>{category}</h3>
                                            <div className={`w-3 h-1 rounded-full transition-all duration-300 ${
                                                activeCategory === category ? 'bg-gold-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-600'
                                            }`}></div>
                                        </div>
                                        <div className="flex-1"></div>
                                    </div>
                                }
                                className={`border-0 rounded-xl mb-4 overflow-hidden transition-all duration-300 ${
                                    activeCategory === category
                                        ? 'ring-2 ring-gold-500/20 bg-gradient-to-r from-white to-gold-50/20 dark:from-neutral-900/80 dark:to-gold-900/10'
                                        : 'bg-white dark:bg-neutral-900/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                                }`}
                            >
                                {/* Category Items Row */}
                                <div className="grid grid-cols-1 gap-4 p-4">
                                    {categoryItems.map(item => (
                                        <div key={item.id} className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900/80 dark:to-neutral-800/60 border border-neutral-200/50 dark:border-white/10 p-4 rounded-2xl flex gap-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-gold-400/80 dark:hover:border-gold-400/60 hover:scale-[1.02] group cursor-pointer">
                                            <div className="relative flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 shadow-md group-hover:shadow-xl transition-shadow duration-300" />
                                                
                                            </div>
                                            <div className="flex flex-col justify-between flex-1 py-1">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{item.name}</h3>
                                                        <span className="px-2 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs rounded-full font-medium border border-gold-500/20">{item.category}</span>
                                                    </div>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">{item.description}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-2xl text-gold-600 dark:text-gold-500">₹{item.price}</span>
                                                        {item.price > 200 && (
                                                            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full font-medium border border-green-500/20">Popular</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-gold-600 group-hover:to-gold-700"
                                                    >
                                                        <Plus size={20} className="group-active:scale-75 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        );
                    })}
                </Collapse>
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

    const activeOrders = orders.filter(item => item.tableId === guestTableId && item.status !== OrderStatus.PAID);
    const table = tables.find(t => t.id === guestTableId);

    // Calculate totals
    const grandTotal = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const handlePay = async () => {
        // Simulate payment process
        messageApi.loading('Processing payment...', 1.5)
            .then(() => {
                activeOrders.forEach(item => updateOrderStatus(item.id, OrderStatus.PAID));
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
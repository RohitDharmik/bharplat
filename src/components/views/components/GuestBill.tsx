import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Modal, message } from 'antd';
import { Utensils, CreditCard } from 'lucide-react';
import { OrderStatus, Table } from '../../../types';

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
                {contextHolder}
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
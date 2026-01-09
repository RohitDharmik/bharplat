import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Modal, message } from 'antd';
import { Utensils, CreditCard } from 'lucide-react';
import { OrderStatus, Table } from '../../../types';
import { ResponsiveContainer } from '../../ui/ResponsiveGrid';
import { PriceDisplay } from '../../ui/Controls';
import { OrderCard } from '../../ui/Cards';
import { useFilteredData } from '../../../hooks/useMemoizedData';

export const GuestBill: React.FC = () => {
    const { orders, guestTableId, updateOrderStatus, tables } = useAppStore();
    const [messageApi, contextHolder] = message.useMessage();

    // Memoize active orders for performance
    const activeOrders = useFilteredData(
        orders,
        (item) => item.tableId === guestTableId && item.status !== OrderStatus.PAID,
        [guestTableId]
    );

    const table = tables.find(t => t.id === guestTableId);

    // Calculate totals with memoization
    const totals = useMemo(() => {
        const grandTotal = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const taxAmount = grandTotal * 0.15;
        const finalTotal = grandTotal + taxAmount;
        return { grandTotal, taxAmount, finalTotal };
    }, [activeOrders]);

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
            <ResponsiveContainer maxWidth="md">
                {contextHolder}
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                    <div className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400">
                        <Utensils size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">No Active Orders</h3>
                    <p className="text-neutral-500 dark:text-neutral-400">You haven't ordered anything yet, or your bill is fully paid.</p>
                </div>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer maxWidth="md">
            {contextHolder}
            
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Bill</h2>
                <p className="text-neutral-500 dark:text-neutral-400">{table?.name}</p>
            </div>

            <div className="space-y-4 mb-6">
                {activeOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        orderId={order.id}
                        table={table?.name || 'Table'}
                        items={order.items.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price
                        }))}
                        total={order.totalAmount}
                        status={order.status}
                        createdAt={new Date(order.createdAt)}
                    />
                ))}
            </div>

            <div className="bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl p-6 shadow-xl">
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-neutral-300 dark:text-neutral-600 text-sm">
                        <span>Subtotal</span>
                        <PriceDisplay price={totals.grandTotal} size="md" />
                    </div>
                    <div className="flex justify-between items-center text-neutral-300 dark:text-neutral-600 text-sm">
                        <span>Tax & Service (15%)</span>
                        <PriceDisplay price={totals.taxAmount} size="md" />
                    </div>
                    <div className="border-t border-neutral-700 dark:border-neutral-300 my-2"></div>
                    <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Total</span>
                        <PriceDisplay price={totals.finalTotal} size="lg" />
                    </div>
                </div>

                <button 
                    onClick={handlePay}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors"
                >
                    <CreditCard size={20} />
                    Pay Bill Now
                </button>
                <div className="mt-4 text-center">
                    <p className="text-xs text-neutral-300 dark:text-neutral-600">Secure payment powered by Stripe</p>
                </div>
            </div>
        </ResponsiveContainer>
    );
};
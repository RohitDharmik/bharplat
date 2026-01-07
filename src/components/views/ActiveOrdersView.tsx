import React, { useState } from 'react';
import { Order, OrderStatus, Table } from '../../types';
import { Clock, MessageSquare, AlertCircle, ChefHat, Check } from 'lucide-react';
import { Button, Modal, Input, message, Tag } from 'antd';
import { useAppStore } from '../../store/useAppStore';

interface ActiveOrdersViewProps {
  orders: Order[];
  tables: Table[];
}

export const ActiveOrdersView: React.FC<ActiveOrdersViewProps> = ({ orders, tables }) => {
  const { updateOrderNotes, updateOrderStatus } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  // Filter orders that are NOT completed
  const activeOrders = orders.filter(item => item.status !== OrderStatus.COMPLETED);
  
  const filteredOrders = filterStatus === 'All'
    ? activeOrders
    : activeOrders.filter(item => item.status === filterStatus);

  const handleOpenNotes = (order: Order) => {
    setSelectedOrder(order);
    setCurrentNotes(order.notes || '');
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (selectedOrder) {
      await updateOrderNotes(selectedOrder.id, currentNotes);
      messageApi.success('Notes updated successfully');
      setIsNotesModalOpen(false);
    }
  };

  const advanceStatus = async (order: Order) => {
    let nextStatus: OrderStatus | null = null;
    switch(order.status) {
      case OrderStatus.PENDING: nextStatus = OrderStatus.ORDERED; break;
      case OrderStatus.ORDERED: nextStatus = OrderStatus.PREPARING; break;
      case OrderStatus.PREPARING: nextStatus = OrderStatus.READY; break;
      case OrderStatus.READY: nextStatus = OrderStatus.SERVED; break;
      case OrderStatus.SERVED: nextStatus = OrderStatus.PAID; break;
      default: break;
    }
    if (nextStatus) {
      await updateOrderStatus(order.id, nextStatus);
      messageApi.success(`Order status updated to ${nextStatus}`);
    }
  };

  const statusColors: Record<string, string> = {
    [OrderStatus.PENDING]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    [OrderStatus.ORDERED]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [OrderStatus.PREPARING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [OrderStatus.READY]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [OrderStatus.SERVED]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Active Orders Overview</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Monitor all ongoing dining orders in real-time</p>
        </div>
        <div className="flex gap-2 bg-neutral-100 dark:bg-white/5 p-1 rounded-lg">
          {['All', OrderStatus.PENDING, OrderStatus.ORDERED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.SERVED].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filterStatus === status 
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOrders.length === 0 ? (
           <div className="col-span-full py-20 text-center text-neutral-500 bg-neutral-50 dark:bg-white/5 rounded-xl border border-dashed border-neutral-200 dark:border-white/10">
             <AlertCircle size={40} className="mx-auto mb-3 opacity-30" />
             <p>No active orders found for this filter.</p>
           </div>
        ) : (
          filteredOrders.map(order => {
            const table = tables.find(t => t.id === order.tableId);
            return (
              <div key={order.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-5 shadow-sm dark:shadow-none flex flex-col hover:border-gold-500/30 transition-all group">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{table?.name || 'Unknown'}</h3>
                      <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase border ${statusColors[order.status] || 'bg-gray-500/10 text-gray-500'}`}>
                         {order.status}
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="block font-mono font-bold text-gold-600 dark:text-gold-500">₹{order.totalAmount.toFixed(2)}</span>
                      <span className="text-xs text-neutral-400 flex items-center justify-end gap-1 mt-1">
                        <Clock size={10} />
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                   </div>
                </div>

                {/* Notes Badge */}
                {order.notes && (
                  <div className="mb-3 px-2 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded text-xs text-yellow-700 dark:text-yellow-400 italic flex gap-2">
                    <AlertCircle size={12} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.notes}</span>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex gap-2 text-neutral-700 dark:text-neutral-300">
                        <span className="font-bold">{item.quantity}x</span>
                        <span className="line-clamp-1">{item.name}</span>
                      </div>
                      {item.notes && <span className="text-xs text-neutral-400 italic">({item.notes})</span>}
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 pt-4 border-t border-neutral-100 dark:border-white/5">
                   <button 
                     onClick={() => handleOpenNotes(order)}
                     className="p-2 text-neutral-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
                     title="Edit Notes"
                   >
                     <MessageSquare size={18} />
                   </button>
                   <button 
                     onClick={() => advanceStatus(order)}
                     className="flex-1 bg-neutral-100 dark:bg-white/10 hover:bg-gold-500 hover:text-black text-neutral-600 dark:text-neutral-300 rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-gold-500 group-hover:text-black"
                   >
                     {order.status === OrderStatus.SERVED ? 'Pay' : 'Next Stage'}
                     <Check size={16} />
                   </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        title="Manage Order Notes"
        open={isNotesModalOpen}
        onOk={handleSaveNotes}
        onCancel={() => setIsNotesModalOpen(false)}
        okText="Save Notes"
      >
        <div className="space-y-4">
          <div className="p-3 bg-neutral-50 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10">
             <div className="flex justify-between text-xs text-neutral-500 uppercase tracking-wide mb-1">
               <span>Order ID</span>
               <span>Table</span>
             </div>
             <div className="flex justify-between font-bold text-neutral-900 dark:text-white">
               <span className="font-mono">{selectedOrder?.id}</span>
               <span>{tables.find(t => t.id === selectedOrder?.tableId)?.name}</span>
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Special Instructions / Allergies</label>
            <Input.TextArea 
              rows={4}
              value={currentNotes}
              onChange={e => setCurrentNotes(e.target.value)}
              placeholder="Enter details here..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
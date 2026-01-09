import React, { useState } from 'react';
import { Order, OrderStatus, Table } from '../../types';
import { Search, Download, Eye } from 'lucide-react';
import { Table as AntTable, Tag, Button, Modal } from 'antd';

interface PaymentHistoryViewProps {
  orders: Order[];
  tables: Table[];
  title?: string;
}

  const PaymentHistoryView: React.FC<PaymentHistoryViewProps> = ({ orders, tables, title = 'Payment History' }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter for PAID orders
  const paidOrders = orders.filter(item => item.status === OrderStatus.PAID);

  // Filter by search
  const filteredOrders = paidOrders.filter(order => {
    const table = tables.find(t => t.id === order.tableId);
    const searchLower = searchText.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      (table?.name || '').toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <span className="font-mono text-xs">{id}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => (
        <div className="flex flex-col">
           <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
           <span className="text-xs text-neutral-500">{new Date(date).toLocaleTimeString()}</span>
        </div>
      ),
      sorter: (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    },
    {
      title: 'Table',
      dataIndex: 'tableId',
      key: 'tableId',
      render: (id: string) => {
        const table = tables.find(t => t.id === id);
        return <span className="font-medium">{table?.name || id}</span>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span className="font-bold text-gold-600 dark:text-gold-500">₹{amount.toFixed(2)}</span>,
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },
    {
        title: 'Items',
        key: 'items',
        render: (_, record: Order) => (
             <span className="text-sm text-neutral-500">{record.items.length} items</span>
        )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="success">PAID</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Order) => (
        <Button 
            type="text" 
            icon={<Eye size={16} />} 
            onClick={() => {
                setSelectedOrder(record);
                setIsModalOpen(true);
            }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">View all settled transactions</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search Order ID or Table..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-neutral-900 dark:text-white focus:border-gold-500/50 focus:outline-none"
            />
          </div>
          <Button icon={<Download size={16} />} className="flex items-center gap-2">Export</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden backdrop-blur-md shadow-sm dark:shadow-none p-6">
        <AntTable 
            dataSource={filteredOrders} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
        />
      </div>

      <Modal
        title="Transaction Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>,
            <Button key="print" type="primary" className="bg-gold-500 text-black border-none">Print Receipt</Button>
        ]}
      >
        {selectedOrder && (
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <div>
                        <p className="text-xs text-neutral-500">Order ID</p>
                        <p className="font-mono font-bold">{selectedOrder.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-neutral-500">Date</p>
                        <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-2">Items</h4>
                    <div className="border rounded-lg overflow-hidden">
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between p-3 border-b last:border-0 border-neutral-100">
                                <div>
                                    <span className="font-bold mr-2">{item.quantity}x</span>
                                    <span>{item.name}</span>
                                    {item.notes && <div className="text-xs text-neutral-500 ml-6">{item.notes}</div>}
                                </div>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t mt-4">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-xl text-gold-600">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};
export default PaymentHistoryView;
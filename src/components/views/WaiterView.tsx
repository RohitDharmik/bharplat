import React, { useState, useEffect, useRef } from 'react';
import { Table, Order, OrderStatus, TableStatus, Reservation } from '../../types';
import { Clock, DollarSign, CheckCircle, ChefHat, AlertCircle, History, CalendarPlus, MessageSquare } from 'lucide-react';
import { Modal, Table as AntTable, Tag, Button, Form, Input, InputNumber, DatePicker, TimePicker, message, notification } from 'antd';
import { useAppStore } from '../../store/useAppStore';
import { ResponsiveContainer, ResponsiveGrid } from '../ui/ResponsiveGrid';
import { TableCard, OrderCard } from '../ui/Cards';
import { SuspenseWrapper } from '../ui/SuspenseWrapper';
import dayjs from 'dayjs';

interface WaiterViewProps {
  tables: Table[];
  orders: Order[];
  onTableClick: (table: Table) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

  const WaiterView: React.FC<WaiterViewProps> = ({ tables, orders, onTableClick, onUpdateOrderStatus }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  
  // Notes Modal State
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedOrderForNotes, setSelectedOrderForNotes] = useState<Order | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');

  const { addReservation, updateOrderNotes } = useAppStore();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Simulate assigned tables (e.g., first 4 tables are assigned to this waiter)
  const myTables = tables.slice(0, 4); 
  
  // Get orders that belong to my tables and are not yet fully paid
  const myActiveOrders = orders.filter(item => myTables.some(t => t.id === item.tableId) && item.status !== OrderStatus.PAID);

  // Get history orders (Paid orders for my tables)
  const myHistoryOrders = orders.filter(item => myTables.some(t => t.id === item.tableId) && item.status === OrderStatus.PAID);
  
  // Sort by date descending
  const sortedHistory = [...myHistoryOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Effect to listen for order status changes (Real-time updates)
  const prevOrdersRef = useRef<Order[]>(orders);
  
  useEffect(() => {
      const prevOrders = prevOrdersRef.current;
      
      // Check for status changes in my orders
      orders.forEach(order => {
          // Only care about orders for my tables
          if (!myTables.find(t => t.id === order.tableId)) return;

          const prev = prevOrders.find(po => po.id === order.id);
          if (prev && prev.status !== order.status) {
              // Status changed
              if (order.status === OrderStatus.READY) {
                  const tableName = tables.find(t => t.id === order.tableId)?.name || 'Unknown Table';
                  notification.success({
                      message: 'Order Ready!',
                      description: `${tableName} - Order #${order.id} is ready for pickup at the counter.`,
                      placement: 'topRight',
                      icon: <CheckCircle className="text-green-500" />
                  });
              }
          }
      });
      prevOrdersRef.current = orders;
  }, [orders, myTables, tables]);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20';
      case TableStatus.OCCUPIED: return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20';
      case TableStatus.RESERVED: return 'border-gold-500/30 bg-gold-500/10 text-gold-600 dark:text-gold-400 hover:bg-gold-500/20';
      case TableStatus.DIRTY: return 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20';
      default: return 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800';
    }
  };

  const handleProcessPayment = (orderId: string) => {
    if (window.confirm('Confirm payment received?')) {
      onUpdateOrderStatus(orderId, OrderStatus.PAID);
    }
  };

  const handleReservationSubmit = () => {
    form.validateFields().then(async (values) => {
        const datePart = values.date;
        const timePart = values.time;
        const fullDate = datePart.hour(timePart.hour()).minute(timePart.minute()).toDate();

        const newRes: Reservation = {
            id: `r${Date.now()}`,
            customerName: values.customerName,
            customerPhone: values.customerPhone,
            guests: values.guests,
            date: fullDate,
            status: 'Pending',
            notes: values.notes
        };
        
        await addReservation(newRes);
        messageApi.success('Table booked successfully');
        setIsReservationOpen(false);
        form.resetFields();
    });
  };

  const handleOpenNotes = (order: Order) => {
    setSelectedOrderForNotes(order);
    setCurrentNotes(order.notes || '');
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (selectedOrderForNotes) {
        await updateOrderNotes(selectedOrderForNotes.id, currentNotes);
        messageApi.success('Customer notes updated');
        setIsNotesModalOpen(false);
    }
  };

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => <span className="text-neutral-500">{new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>,
      sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
        title: 'Table',
        dataIndex: 'tableId',
        key: 'tableId',
        render: (id: string) => {
            const table = tables.find(t => t.id === id);
            return <span className="font-medium">{table?.name || id}</span>;
        }
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record: Order) => (
        <div className="max-h-20 overflow-y-auto text-xs">
          {record.items.map((item, idx) => (
            <div key={idx}>{item.quantity}x {item.name}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span className="font-bold text-gold-600">₹{amount.toFixed(2)}</span>,
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="success">{status}</Tag>,
    }
  ];

  return (
    <SuspenseWrapper>
      <ResponsiveContainer maxWidth="7xl">
        {contextHolder}
        
        {/* Tables Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">My Station</h2>
          {/* Responsive Grid for tables: 2 col mobile, 4 col tablet/desktop */}
          <ResponsiveGrid 
            columns={{ mobile: 2, tablet: 4, desktop: 4, largeDesktop: 4 }}
            gap="4"
          >
            {myTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onClick={() => onTableClick(table)}
              />
            ))}
          </ResponsiveGrid>
        </div>

        {/* Orders Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Active Orders</h2>
              <div className="flex gap-3 w-full md:w-auto">
                  <Button 
                      onClick={() => setIsReservationOpen(true)}
                      icon={<CalendarPlus size={16} />}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:text-gold-500 hover:border-gold-500 bg-transparent"
                  >
                      Book Table
                  </Button>
                  <Button 
                      onClick={() => setIsHistoryOpen(true)} 
                      icon={<History size={16} />}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 border-gold-500/50 text-gold-600 hover:text-gold-500 hover:border-gold-500 bg-transparent"
                  >
                      History
                  </Button>
              </div>
          </div>
          
          <ResponsiveGrid 
            columns={{ mobile: 1, tablet: 2, desktop: 3, largeDesktop: 3 }}
            gap="6"
          >
            {myActiveOrders.length === 0 ? (
              <div className="col-span-full text-center py-12 text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl border border-dashed border-neutral-300 dark:border-white/10">
                <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                No active orders at your station.
              </div>
            ) : (
              myActiveOrders.map(order => {
                const table = tables.find(t => t.id === order.tableId);
                return (
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
                    onStatusChange={(status) => onUpdateOrderStatus(order.id, status as OrderStatus)}
                    onEdit={() => handleOpenNotes(order)}
                    onDelete={() => handleProcessPayment(order.id)}
                  />
                );
              })
            )}
          </ResponsiveGrid>
        </div>

        <Modal
          title="Station Order History"
          open={isHistoryOpen}
          onCancel={() => setIsHistoryOpen(false)}
          footer={[
              <Button key="close" onClick={() => setIsHistoryOpen(false)}>
              Close
              </Button>
          ]}
          width={800}
          className="history-modal"
        >
          <AntTable 
              dataSource={sortedHistory} 
              columns={historyColumns} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 600 }}
          />
        </Modal>

        <Modal
          title="Book a Table"
          open={isReservationOpen}
          onOk={handleReservationSubmit}
          onCancel={() => setIsReservationOpen(false)}
          okText="Confirm Booking"
        >
          <Form form={form} layout="vertical" initialValues={{ guests: 2, date: dayjs(), time: dayjs() }}>
              <Form.Item name="customerName" label="Customer Name" rules={[{ required: true, message: 'Required' }]}>
                  <Input placeholder="John Doe" />
              </Form.Item>
              <Form.Item name="customerPhone" label="Phone" rules={[{ required: true, message: 'Required' }]}>
                  <Input placeholder="+1 234 567 8900" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                      <DatePicker className="w-full" />
                  </Form.Item>
                  <Form.Item name="time" label="Time" rules={[{ required: true }]}>
                      <TimePicker className="w-full" format="HH:mm" />
                  </Form.Item>
              </div>
              <Form.Item name="guests" label="Guests" rules={[{ required: true }]}>
                  <InputNumber min={1} className="w-full" />
              </Form.Item>
               <Form.Item name="notes" label="Special Requests">
                  <Input.TextArea rows={2} />
              </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Customer Notes"
          open={isNotesModalOpen}
          onOk={handleSaveNotes}
          onCancel={() => setIsNotesModalOpen(false)}
          okText="Save Notes"
        >
            <div className="space-y-4">
                <div className="p-3 bg-neutral-50 border rounded-lg">
                    <span className="text-xs text-neutral-500 uppercase font-bold">Order ID</span>
                    <p className="font-mono text-sm">{selectedOrderForNotes?.id}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Preferences & Requests</label>
                    <Input.TextArea 
                      rows={4} 
                      value={currentNotes} 
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      placeholder="E.g. Customer is celebrating a birthday, allergic to shellfish..."
                    />
                </div>
            </div>
        </Modal>
      </ResponsiveContainer>
    </SuspenseWrapper>
  );
};
export default WaiterView;
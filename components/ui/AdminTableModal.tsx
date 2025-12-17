import React from 'react';
import { Modal, Button, Table as AntTable, Tag } from 'antd';
import { History, Clock } from 'lucide-react';
import { Table, TableStatus, OrderStatus } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface AdminTableModalProps {
  table: Table | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: TableStatus) => void;
}

export const AdminTableModal: React.FC<AdminTableModalProps> = ({ 
  table, 
  isOpen, 
  onClose, 
  onStatusChange 
}) => {
  const { orders } = useAppStore();

  const getTableHistory = (tableId: string) => {
      return orders.filter(o => o.tableId === tableId && o.status === OrderStatus.PAID)
                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <Modal
      title={
          <div className="flex items-center gap-2">
              <span className="font-bold text-xl">{table?.name} Details</span>
              <span className="text-xs font-normal text-neutral-500 bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded">
                  {table?.zone}
              </span>
          </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
           <Button key="close" onClick={onClose}>Close</Button>
      ]}
      width={700}
    >
      {table && (
          <div className="space-y-6 pt-4">
              {/* Status Control */}
              <div className="bg-neutral-50 dark:bg-white/5 p-4 rounded-xl border border-neutral-200 dark:border-white/10">
                  <h4 className="text-sm font-bold text-neutral-500 mb-3 uppercase tracking-wide">Table Status</h4>
                  <div className="flex gap-2 flex-wrap">
                      {Object.values(TableStatus).map(status => (
                          <button
                              key={status}
                              onClick={() => onStatusChange(status)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  table.status === status
                                  ? status === TableStatus.AVAILABLE ? 'bg-green-500 text-white' 
                                  : status === TableStatus.OCCUPIED ? 'bg-red-500 text-white'
                                  : status === TableStatus.RESERVED ? 'bg-gold-500 text-black'
                                  : 'bg-orange-500 text-white'
                                  : 'bg-white dark:bg-black border border-neutral-200 dark:border-white/20 hover:border-gold-500'
                              }`}
                          >
                              {status}
                          </button>
                      ))}
                  </div>
              </div>

              {/* History Section */}
              <div>
                   <h4 className="text-sm font-bold text-neutral-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <History size={16} />
                      Order History
                   </h4>
                   {getTableHistory(table.id).length === 0 ? (
                       <div className="text-center py-8 text-neutral-500 bg-neutral-50 dark:bg-white/5 rounded-xl border border-dashed border-neutral-200 dark:border-white/10">
                           <Clock className="mx-auto mb-2 opacity-50" />
                           No past orders found for this table.
                       </div>
                   ) : (
                       <div className="border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden">
                           <AntTable
                              dataSource={getTableHistory(table.id)}
                              rowKey="id"
                              pagination={{ pageSize: 3, size: 'small' }}
                              size="small"
                              columns={[
                                  {
                                      title: 'Date',
                                      dataIndex: 'createdAt',
                                      render: (date) => <span className="text-xs">{new Date(date).toLocaleDateString()}</span>
                                  },
                                  {
                                      title: 'Order ID',
                                      dataIndex: 'id',
                                      render: (id) => <span className="font-mono text-xs">{id}</span>
                                  },
                                  {
                                      title: 'Items',
                                      dataIndex: 'items',
                                      render: (items: any[]) => <span className="text-xs">{items.length} items</span>
                                  },
                                  {
                                      title: 'Total',
                                      dataIndex: 'totalAmount',
                                      render: (val) => <span className="font-bold text-gold-600">₹{val.toFixed(2)}</span>
                                  },
                                  {
                                      title: 'Status',
                                      dataIndex: 'status',
                                      render: (status) => <Tag color="success" className="mr-0">{status}</Tag>
                                  }
                              ]}
                           />
                       </div>
                   )}
              </div>
          </div>
      )}
    </Modal>
  );
};
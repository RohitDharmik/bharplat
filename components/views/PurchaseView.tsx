import React, { useState } from 'react';
import { Purchase } from '../../types';
import { MOCK_PURCHASES } from '../../constants';
import { Plus, FileText, Calendar } from 'lucide-react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

export const PurchaseView: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleAddPurchase = () => {
    form.validateFields().then(values => {
        const newPurchase: Purchase = {
            id: `p${Date.now()}`,
            vendorName: values.vendorName,
            date: values.date.toDate(),
            totalAmount: values.totalAmount,
            status: 'Received',
            items: values.items
        };
        setPurchases([newPurchase, ...purchases]);
        messageApi.success('Purchase recorded');
        setIsModalOpen(false);
        form.resetFields();
    });
  };

  const columns = [
      {
          title: 'Purchase ID',
          dataIndex: 'id',
          key: 'id',
          render: (text: string) => <span className="font-mono">{text}</span>
      },
      {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          render: (date: Date) => <span>{date.toLocaleDateString()}</span>
      },
      {
          title: 'Vendor',
          dataIndex: 'vendorName',
          key: 'vendorName',
          render: (text: string) => <span className="font-bold">{text}</span>
      },
      {
          title: 'Items',
          dataIndex: 'items',
          key: 'items',
          render: (items: any[]) => (
              <ul className="text-xs list-disc pl-4 m-0">
                  {items.map((i, idx) => (
                      <li key={idx}>{i.quantity}x {i.name}</li>
                  ))}
              </ul>
          )
      },
      {
          title: 'Amount',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          render: (amt: number) => <span className="font-bold text-gold-600">₹{amt}</span>
      },
      {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (status: string) => <Tag color={status === 'Received' ? 'green' : 'orange'}>{status}</Tag>
      }
  ];

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Purchase History</h2>
           <p className="text-neutral-500 dark:text-neutral-400 text-sm">Track incoming stock and vendor payments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} /> Record Purchase
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm dark:shadow-none p-6">
          <Table 
             dataSource={purchases} 
             columns={columns} 
             rowKey="id"
             pagination={{ pageSize: 5 }}
          />
      </div>

      <Modal
        title="Record New Purchase"
        open={isModalOpen}
        onOk={handleAddPurchase}
        onCancel={() => setIsModalOpen(false)}
        okText="Save Record"
      >
          <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
              <Form.Item name="vendorName" label="Vendor Name" rules={[{ required: true }]}>
                  <Input />
              </Form.Item>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                  <DatePicker className="w-full" />
              </Form.Item>
              <Form.List name="items" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                      <>
                          {fields.map(({ key, name, ...restField }) => (
                              <div key={key} className="flex gap-2 items-end mb-2">
                                  <Form.Item {...restField} name={[name, 'name']} label={key === 0 ? "Product" : ""} className="flex-1 mb-0" rules={[{ required: true }]}>
                                      <Input placeholder="Item Name" />
                                  </Form.Item>
                                  <Form.Item {...restField} name={[name, 'quantity']} label={key === 0 ? "Qty" : ""} className="w-20 mb-0" rules={[{ required: true }]}>
                                      <InputNumber min={1} placeholder="Qty" />
                                  </Form.Item>
                                  <Form.Item {...restField} name={[name, 'price']} label={key === 0 ? "Cost" : ""} className="w-24 mb-0" rules={[{ required: true }]}>
                                      <InputNumber min={0} placeholder="₹" />
                                  </Form.Item>
                              </div>
                          ))}
                          <Button type="dashed" onClick={() => add()} block className="mt-2" icon={<Plus size={14} />}>
                              Add Item
                          </Button>
                      </>
                  )}
              </Form.List>
              <Form.Item name="totalAmount" label="Total Invoice Amount" className="mt-4" rules={[{ required: true }]}>
                  <InputNumber className="w-full" prefix="₹" />
              </Form.Item>
          </Form>
      </Modal>
    </div>
  );
};
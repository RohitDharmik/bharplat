import React, { useState } from 'react';
import { Customer } from '../../types';
import { MOCK_CUSTOMERS } from '../../constants';
import { Search, Plus, Mail, Phone, Calendar, User } from 'lucide-react';
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd';

  const CustomersView: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleAddCustomer = () => {
        form.validateFields().then(values => {
            const newCustomer: Customer = {
                id: `c${Date.now()}`,
                name: values.name,
                phone: values.phone,
                email: values.email,
                visits: 1,
                totalSpent: 0,
                lastVisit: new Date(),
                notes: values.notes
            };
            setCustomers([...customers, newCustomer]);
            messageApi.success('Customer added successfully');
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-bold text-neutral-900 dark:text-white">{text}</span>
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_: any, record: Customer) => (
                <div className="flex flex-col text-sm text-neutral-500">
                    <span className="flex items-center gap-1"><Phone size={12} /> {record.phone}</span>
                    {record.email && <span className="flex items-center gap-1"><Mail size={12} /> {record.email}</span>}
                </div>
            )
        },
        {
            title: 'Visits',
            dataIndex: 'visits',
            key: 'visits',
            sorter: (a: Customer, b: Customer) => a.visits - b.visits,
            render: (visits: number) => <Tag color="blue">{visits} Visits</Tag>
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            sorter: (a: Customer, b: Customer) => a.totalSpent - b.totalSpent,
            render: (val: number) => <span className="font-mono text-gold-600">₹{val.toFixed(2)}</span>
        },
        {
            title: 'Last Visit',
            dataIndex: 'lastVisit',
            key: 'lastVisit',
            render: (date: Date) => <span className="text-neutral-500">{date.toLocaleDateString()}</span>
        }
    ];

    return (
        <div className="space-y-6">
            {contextHolder}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Customer CRM</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">Manage customer profiles and history</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or phone..." 
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-neutral-900 dark:text-white focus:border-gold-500/50 focus:outline-none"
                        />
                    </div>
                    <Button 
                        type="primary" 
                        icon={<Plus size={16} />} 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gold-500 text-black border-none hover:bg-gold-400 flex items-center"
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm dark:shadow-none p-6">
                <Table 
                    dataSource={customers} 
                    columns={columns} 
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                />
            </div>

            <Modal
                title="Add New Customer"
                open={isModalOpen}
                onOk={handleAddCustomer}
                onCancel={() => setIsModalOpen(false)}
                okText="Save Customer"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input prefix={<User size={14} />} />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                        <Input prefix={<Phone size={14} />} />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input prefix={<Mail size={14} />} />
                    </Form.Item>
                    <Form.Item name="notes" label="Notes">
                        <Input.TextArea rows={3} placeholder="Dietary preferences, special dates..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default CustomersView;
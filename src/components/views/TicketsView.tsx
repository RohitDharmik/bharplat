import React, { useState } from 'react';
import { Ticket } from '../../types';
import { MOCK_TICKETS } from '../../constants';
import { Plus, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Modal, Form, Input, Select, Tag, Button, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

export const TicketsView: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreateTicket = () => {
    form.validateFields().then((values) => {
        const newTicket: Ticket = {
            id: `tk${Date.now()}`,
            subject: values.subject,
            category: values.category,
            description: values.description,
            status: 'Pending',
            createdAt: new Date()
        };
        setTickets([newTicket, ...tickets]);
        messageApi.success('Support ticket raised successfully');
        setIsModalOpen(false);
        form.resetFields();
    });
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Resolved': return 'success';
          case 'Closed': return 'default';
          case 'In Process': return 'processing';
          default: return 'warning';
      }
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Support Tickets</h2>
           <p className="text-neutral-500 dark:text-neutral-400 text-sm">Raise issues or request new features</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} /> Raise Ticket
        </button>
      </div>

      <div className="grid gap-4">
          {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 p-6 rounded-xl shadow-sm dark:shadow-none hover:border-gold-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-neutral-100 dark:bg-white/5 rounded-full">
                              {ticket.category === 'Technical' ? <AlertCircle className="text-red-500" /> : <MessageSquare className="text-blue-500" />}
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{ticket.subject}</h3>
                              <p className="text-xs text-neutral-500">ID: {ticket.id} • {ticket.category} • {ticket.createdAt.toLocaleDateString()}</p>
                          </div>
                      </div>
                      <Tag color={getStatusColor(ticket.status)} className="px-3 py-1 text-sm font-medium rounded-full m-0">
                          {ticket.status}
                      </Tag>
                  </div>
                  <div className="pl-14">
                      <p className="text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-black/20 p-4 rounded-lg border border-neutral-200 dark:border-white/5">
                          {ticket.description}
                      </p>
                      {ticket.status === 'Resolved' && (
                          <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-medium">
                              <CheckCircle size={16} /> Issue Resolved
                          </div>
                      )}
                      {ticket.status === 'Pending' && (
                          <div className="mt-4 flex items-center gap-2 text-orange-500 text-sm font-medium">
                              <Clock size={16} /> Awaiting Response
                          </div>
                      )}
                  </div>
              </div>
          ))}
      </div>

      <Modal
        title="Raise Support Ticket"
        open={isModalOpen}
        onOk={handleCreateTicket}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit Ticket"
      >
          <Form form={form} layout="vertical">
              <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                  <Input placeholder="Brief summary of the issue" />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                  <Select>
                      <Option value="Technical">Technical Issue</Option>
                      <Option value="Billing">Billing & Subscription</Option>
                      <Option value="Feature Request">Feature Request</Option>
                      <Option value="Other">Other</Option>
                  </Select>
              </Form.Item>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <TextArea rows={5} placeholder="Describe the issue in detail..." />
              </Form.Item>
          </Form>
      </Modal>
    </div>
  );
};
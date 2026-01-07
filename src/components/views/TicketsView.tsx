import React, { useState } from 'react';
import { Ticket, UserRole, FeatureAuthority } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { usePermissions } from '../../hooks/usePermissions';
import { Plus, MessageSquare, CheckCircle, Clock, AlertCircle, Edit, X } from 'lucide-react';
import { Modal, Form, Input, Select, Tag, Button, message } from 'antd';
import { PermissionGuard } from '../ui/PermissionGuard';

const { Option } = Select;
const { TextArea } = Input;

interface TicketsViewProps {
  userRole: UserRole;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ userRole }) => {
  const { tickets, createTicket, updateTicket, closeTicket } = useAppStore();
  const permissions = usePermissions(userRole);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreateTicket = async () => {
    try {
      const values = await form.validateFields();
      await createTicket({
        subject: values.subject,
        category: values.category,
        description: values.description,
        status: 'Pending',
        priority: values.priority || 'Medium',
        assignedTo: values.assignedTo
      });
      messageApi.success('Support ticket raised successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleUpdateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      await updateTicket(ticketId, updates);
      messageApi.success('Ticket updated successfully');
      setEditingTicket(null);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      await closeTicket(ticketId);
      messageApi.success('Ticket closed successfully');
    } catch (error) {
      console.error('Failed to close ticket:', error);
    }
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
        <PermissionGuard
          userRole={userRole}
          feature={FeatureAuthority.MANAGE_TICKETS}
          fallback={
            <div className="text-neutral-500 text-sm">
              You can view tickets but don't have permission to create new ones.
            </div>
          }
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus size={18} /> Raise Ticket
          </button>
        </PermissionGuard>
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
                              <p className="text-xs text-neutral-500">
                                ID: {ticket.id} • {ticket.category} • Priority: {ticket.priority} • {ticket.createdAt.toLocaleDateString()}
                                {ticket.assignedTo && ` • Assigned to: ${ticket.assignedTo}`}
                              </p>
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

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        {permissions.canManageTickets && ticket.status === 'Pending' && (
                          <Button
                            size="small"
                            onClick={() => handleUpdateTicket(ticket.id, { status: 'In Process' })}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Start Working
                          </Button>
                        )}
                        {permissions.canManageTickets && ticket.status === 'In Process' && (
                          <Button
                            size="small"
                            onClick={() => handleUpdateTicket(ticket.id, { status: 'Resolved' })}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {permissions.canManageTickets && ticket.status !== 'Closed' && (
                          <Button
                            size="small"
                            onClick={() => handleCloseTicket(ticket.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Close Ticket
                          </Button>
                        )}
                        {permissions.canManageTickets && (
                          <Button
                            size="small"
                            icon={<Edit size={14} />}
                            onClick={() => setEditingTicket(ticket)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
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
              <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                  <Select>
                      <Option value="Low">Low</Option>
                      <Option value="Medium">Medium</Option>
                      <Option value="High">High</Option>
                      <Option value="Critical">Critical</Option>
                  </Select>
              </Form.Item>
              {permissions.canManageTickets && (
                <Form.Item name="assignedTo" label="Assign To">
                  <Select placeholder="Select admin to assign">
                    <Option value="u1">Rajesh Sahu</Option>
                    <Option value="u2">Amit Baghel</Option>
                    {/* Add more admin options */}
                  </Select>
                </Form.Item>
              )}
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <TextArea rows={5} placeholder="Describe the issue in detail..." />
              </Form.Item>
          </Form>
      </Modal>

      {/* Edit Ticket Modal */}
      <Modal
        title="Edit Ticket"
        open={!!editingTicket}
        onOk={() => {
          if (editingTicket) {
            form.validateFields().then((values) => {
              handleUpdateTicket(editingTicket.id, {
                subject: values.subject,
                category: values.category,
                description: values.description,
                priority: values.priority,
                assignedTo: values.assignedTo
              });
              form.resetFields();
            });
          }
        }}
        onCancel={() => {
          setEditingTicket(null);
          form.resetFields();
        }}
        okText="Update Ticket"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingTicket ? {
            subject: editingTicket.subject,
            category: editingTicket.category,
            description: editingTicket.description,
            priority: editingTicket.priority,
            assignedTo: editingTicket.assignedTo
          } : {}}
        >
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
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
              <Option value="Critical">Critical</Option>
            </Select>
          </Form.Item>
          {permissions.canManageTickets && (
            <Form.Item name="assignedTo" label="Assign To">
              <Select placeholder="Select admin to assign">
                <Option value="u1">Rajesh Sahu</Option>
                <Option value="u2">Amit Baghel</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={5} placeholder="Describe the issue in detail..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
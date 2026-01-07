import React, { useState } from 'react';
import { Area } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Edit, Trash2, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Modal, Form, Input, Button, Switch, message, Table } from 'antd';

export const AreaMaster: React.FC = () => {
  const { areas, createArea, updateArea, deleteArea, isLoading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createArea({
        name: values.name,
        description: values.description,
        isActive: values.isActive ?? true
      });
      messageApi.success('Area created successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create area:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingArea) return;
    try {
      const values = await form.validateFields();
      await updateArea(editingArea.id, {
        name: values.name,
        description: values.description,
        isActive: values.isActive
      });
      messageApi.success('Area updated successfully');
      setIsModalOpen(false);
      setEditingArea(null);
      form.resetFields();
    } catch (error) {
      console.error('Failed to update area:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArea(id);
      messageApi.success('Area deleted successfully');
    } catch (error) {
      console.error('Failed to delete area:', error);
    }
  };

  const openEditModal = (area: Area) => {
    setEditingArea(area);
    form.setFieldsValue({
      name: area.name,
      description: area.description,
      isActive: area.isActive
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingArea(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Area Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Area) => (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gold-500" />
          <span className="font-medium text-white">{text}</span>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span className="text-neutral-400">{text || '-'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span className={`flex items-center gap-1 ${isActive ? 'text-green-400' : 'text-red-400'}`}>
          {isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Area) => (
        <div className="flex gap-2">
          <Button
            size="small"
            icon={<Edit size={14} />}
            onClick={() => openEditModal(record)}
          />
          <Button
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Area Master</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Manage restaurant areas/zones</p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={openCreateModal}
          className="bg-gold-500 hover:bg-gold-400 text-black"
        >
          Add Area
        </Button>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <Table
          dataSource={areas}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingArea ? 'Edit Area' : 'Add New Area'}
        open={isModalOpen}
        onOk={editingArea ? handleUpdate : handleCreate}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingArea(null);
          form.resetFields();
        }}
        okText={editingArea ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Area Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Main Hall, Terrace, VIP" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Describe this area..." />
          </Form.Item>
          <Form.Item name="isActive" label="Active Status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

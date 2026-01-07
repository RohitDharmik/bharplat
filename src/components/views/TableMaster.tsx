import React, { useState } from 'react';
import { Table, TableStatus, Area } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Edit, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import { Modal, Form, Input, Select, Button, Switch, message, Table as AntTable, Tag } from 'antd';

const { Option } = Select;

export const TableMaster: React.FC = () => {
  const { tables, areas, createTable, updateTable, deleteTable, isLoading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const getAreaName = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || 'Unknown';
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'success';
      case TableStatus.OCCUPIED: return 'error';
      case TableStatus.RESERVED: return 'warning';
      case TableStatus.DIRTY: return 'default';
      default: return 'default';
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createTable({
        name: values.name,
        capacity: values.capacity,
        status: TableStatus.AVAILABLE,
        areaId: values.areaId
      });
      messageApi.success('Table created successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create table:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingTable) return;
    try {
      const values = await form.validateFields();
      await updateTable(editingTable.id, {
        name: values.name,
        capacity: values.capacity,
        areaId: values.areaId
      });
      messageApi.success('Table updated successfully');
      setIsModalOpen(false);
      setEditingTable(null);
      form.resetFields();
    } catch (error) {
      console.error('Failed to update table:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTable(id);
      messageApi.success('Table deleted successfully');
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  const openEditModal = (table: Table) => {
    setEditingTable(table);
    form.setFieldsValue({
      name: table.name,
      capacity: table.capacity,
      areaId: table.areaId
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTable(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Table Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className="font-medium text-white">{text}</span>
      )
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (capacity: number) => (
        <div className="flex items-center gap-1">
          <Users size={14} className="text-gold-500" />
          <span>{capacity} seats</span>
        </div>
      )
    },
    {
      title: 'Area',
      dataIndex: 'areaId',
      key: 'areaId',
      render: (areaId: string) => (
        <Tag color="blue">{getAreaName(areaId)}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TableStatus) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Table) => (
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
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Table Master</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Manage restaurant tables</p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={openCreateModal}
          className="bg-gold-500 hover:bg-gold-400 text-black"
        >
          Add Table
        </Button>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <AntTable
          dataSource={tables}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingTable ? 'Edit Table' : 'Add New Table'}
        open={isModalOpen}
        onOk={editingTable ? handleUpdate : handleCreate}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTable(null);
          form.resetFields();
        }}
        okText={editingTable ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Table Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Table 1, Table 2" />
          </Form.Item>
          <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
            <Select placeholder="Select capacity">
              <Option value={2}>2 Seats</Option>
              <Option value={4}>4 Seats</Option>
              <Option value={6}>6 Seats</Option>
              <Option value={8}>8 Seats</Option>
              <Option value={10}>10 Seats</Option>
            </Select>
          </Form.Item>
          <Form.Item name="areaId" label="Area" rules={[{ required: true }]}>
            <Select placeholder="Select area">
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

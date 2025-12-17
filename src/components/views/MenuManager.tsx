import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useApi } from '../../hooks/useApi';
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

export const MenuManager: React.FC = () => {
  const { menu, addMenuItem, deleteMenuItem, isLoading } = useAppStore();
  const { getMenu, createMenuItem: apiCreateMenuItem, deleteMenuItem: apiDeleteMenuItem } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch menu from API
        // const menuData = await getMenu();
        // console.log('Menu data from API:', menuData);
        console.log('MenuManager: Ready to fetch menu from API using axiosInstance');
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    };
    
    fetchMenu();
  }, [getMenu]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const newItem: MenuItem = {
          id: `m${Date.now()}`,
          name: values.name,
          price: values.price,
          category: values.category,
          description: values.description,
          image: values.image || 'https://picsum.photos/200/200',
          available: true
        };
        
        try {
          // Using axiosInstance to create menu item
          // await apiCreateMenuItem(newItem);
          // Then update local state
          await addMenuItem(newItem);
          messageApi.success('Menu item added successfully');
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          console.error('Failed to add menu item:', error);
          messageApi.error('Failed to add menu item');
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = async (id: string) => {
    try {
      // Using axiosInstance to delete menu item
      // await apiDeleteMenuItem(id);
      // Then update local state
      await deleteMenuItem(id);
      messageApi.success('Item deleted');
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      messageApi.error('Failed to delete menu item');
    }
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Current Menu</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu.map((item) => (
          <div key={item.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 p-4 rounded-xl flex gap-4 group hover:border-gold-500/30 transition-colors shadow-sm dark:shadow-none">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-24 h-24 object-cover rounded-lg bg-neutral-200 dark:bg-neutral-800"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">{item.name}</h3>
                  <span className="text-gold-600 dark:text-gold-400 font-bold">₹{item.price}</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">{item.description}</p>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${item.available ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                  {item.category}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md text-neutral-500 dark:text-neutral-300"><Edit2 size={16} /></button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-md text-red-500 dark:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        title="Add Menu Item" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Create"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          name="menu_form"
          initialValues={{ category: 'Main', price: 0 }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the item name!' }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Price (₹)"
              rules={[{ required: true, message: 'Please input the price!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Starter">Starter</Option>
                <Option value="Main">Main</Option>
                <Option value="Dessert">Dessert</Option>
                <Option value="Drink">Drink</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Image URL"
            initialValue="https://picsum.photos/200/200"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
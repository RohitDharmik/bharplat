import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useApi } from '../../hooks/useApi';
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd';
import { ResponsiveContainer, ResponsiveGrid } from '../ui/ResponsiveGrid';
import { MenuItemCard } from './components/MenuItemCard';
import { SuspenseWrapper } from '../ui/SuspenseWrapper';

const { Option } = Select;
const { TextArea } = Input;

  const MenuManager: React.FC = () => {
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
    <SuspenseWrapper>
      <ResponsiveContainer maxWidth="7xl">
        {contextHolder}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Current Menu</h2>
          <Button 
            onClick={() => setIsModalOpen(true)}
            icon={<Plus size={18} />}
            className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Add Item
          </Button>
        </div>

        <ResponsiveGrid 
          columns={{ mobile: 1, tablet: 2, desktop: 3, largeDesktop: 4 }}
          gap="4"
        >
          {menu.map((item) => (
            <MenuItemCard key={item.id} item={item} onAddToCart={() => {}} />
          ))}
        </ResponsiveGrid>

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
      </ResponsiveContainer>
    </SuspenseWrapper>
  );
};
export default MenuManager;
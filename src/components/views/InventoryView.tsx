import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';
import { AlertTriangle, Package, RefreshCw, Plus, Edit2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useApi } from '../../hooks/useApi';
import { Modal, Form, Input, InputNumber, Select, message, Button } from 'antd';

const { Option } = Select;

  const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, isLoading } = useAppStore();
  const { getInventory, createInventoryItem: apiCreateInventoryItem } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [form] = Form.useForm();
  const [adjustForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Fetch inventory from API
        // const inventoryData = await getInventory();
        // console.log('Inventory data from API:', inventoryData);
        console.log('InventoryView: Ready to fetch inventory from API using axiosInstance');
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      }
    };
    
    fetchInventory();
  }, [getInventory]);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const newItem: InventoryItem = {
          id: `i${Date.now()}`,
          lastUpdated: new Date(),
          name: values.name,
          quantity: values.quantity,
          unit: values.unit,
          minThreshold: 5, // Default for now, could be added to form
          category: values.category,
          status: 'In Stock'
        };
        
        try {
          // Using axiosInstance to create inventory item
          // await apiCreateInventoryItem(newItem);
          // Then update local state
          await addInventoryItem(newItem);
          messageApi.success('Inventory item added');
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          console.error('Failed to add inventory item:', error);
          messageApi.error('Failed to add inventory item');
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  
  const openAdjustModal = (item: InventoryItem) => {
      setSelectedItem(item);
      adjustForm.setFieldsValue({ quantity: item.quantity });
      setIsAdjustOpen(true);
  };

  const handleAdjustOk = () => {
      adjustForm.validateFields().then(values => {
          // Here we would call an updateInventoryItem action
          messageApi.success(`Stock updated for ${selectedItem?.name}`);
          setIsAdjustOpen(false);
      });
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Inventory</h2>
        <div className="flex gap-2">
           <button className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
             <RefreshCw size={20} />
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
           >
             <Plus size={18} />
             Add Item
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-full text-red-600 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-red-600 dark:text-red-300 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{inventory.filter(i => i.status !== 'In Stock').length} Items</p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-gold-600 dark:text-gold-400">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Total Items</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{inventory.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/5">
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">Item Name</th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">Category</th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">Quantity</th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm">Status</th>
              <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-300 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-neutral-900 dark:text-white">{item.name}</td>
                <td className="p-4 text-neutral-500 dark:text-neutral-400">{item.category}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-900 dark:text-white font-mono">{item.quantity} {item.unit}</span>
                    {/* Visual bar */}
                    <div className="w-24 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.status === 'Low Stock' ? 'bg-orange-500' : 
                          item.status === 'Out of Stock' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (item.quantity / (item.minThreshold * 3)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                     item.status === 'In Stock' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' :
                     item.status === 'Low Stock' ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400' :
                     'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button size="small" icon={<Edit2 size={12} />} onClick={() => openAdjustModal(item)}>Adjust</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Add Inventory Item"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Add to Stock"
      >
        <Form
          form={form}
          layout="vertical"
          name="inventory_form"
          initialValues={{ unit: 'kg', category: 'Produce', quantity: 0 }}
        >
          <Form.Item
            name="name"
            label="Item Name"
            rules={[{ required: true, message: 'Please input the item name!' }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            
            <Form.Item
              name="unit"
              label="Unit"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="kg">kg</Option>
                <Option value="bottles">bottles</Option>
                <Option value="units">units</Option>
                <Option value="oz">oz</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Produce">Produce</Option>
              <Option value="Meat">Meat</Option>
              <Option value="Dairy">Dairy</Option>
              <Option value="Spirits">Spirits</Option>
              <Option value="Dry Goods">Dry Goods</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Adjust Stock: ${selectedItem?.name}`}
        open={isAdjustOpen}
        onOk={handleAdjustOk}
        onCancel={() => setIsAdjustOpen(false)}
        okText="Update Stock"
      >
          <Form form={adjustForm} layout="vertical">
              <Form.Item name="quantity" label="Current Quantity">
                  <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <p className="text-xs text-neutral-500">Unit: {selectedItem?.unit}</p>
          </Form>
      </Modal>
    </div>
  );
};
export default InventoryView;
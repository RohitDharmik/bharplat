import React, { useState } from 'react';
import { MOCK_MENU, MOCK_INVENTORY } from '../../constants';
import { Recipe } from '../../types';
import { Plus, Save, ChefHat, Info } from 'lucide-react';
import { Modal, Form, Select, InputNumber, Button, message, List, Card } from 'antd';

const { Option } = Select;

export const RecipeView: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleCreateRecipe = () => {
     form.validateFields().then(values => {
         const newRecipe: Recipe = {
             id: `rcp${Date.now()}`,
             menuItemId: values.menuItemId,
             ingredients: values.ingredients
         };
         setRecipes([...recipes, newRecipe]);
         messageApi.success('Recipe created successfully');
         setIsModalOpen(false);
         form.resetFields();
     });
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Recipe Management</h2>
           <p className="text-neutral-500 dark:text-neutral-400 text-sm">Map inventory usage to menu items for automated deduction</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} /> New Recipe
        </button>
      </div>

      {recipes.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/30 border border-dashed border-neutral-200 dark:border-white/10 rounded-xl">
              <ChefHat size={48} className="mx-auto text-neutral-400 mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">No recipes configured yet.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => {
              const menuItem = MOCK_MENU.find(m => m.id === recipe.menuItemId);
              return (
                  <div key={recipe.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 p-5 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                          <img src={menuItem?.image} alt={menuItem?.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-200" />
                          <h3 className="font-bold text-neutral-900 dark:text-white">{menuItem?.name}</h3>
                      </div>
                      <div className="space-y-2">
                          <p className="text-xs font-bold text-neutral-500 uppercase">Ingredients</p>
                          {recipe.ingredients.map((ing, idx) => {
                              const inventoryItem = MOCK_INVENTORY.find(i => i.id === ing.inventoryItemId);
                              return (
                                  <div key={idx} className="flex justify-between text-sm border-b border-neutral-100 dark:border-white/5 pb-1">
                                      <span>{inventoryItem?.name}</span>
                                      <span className="font-mono text-gold-600 dark:text-gold-500">{ing.quantity} {ing.unit}</span>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              );
          })}
      </div>

      <Modal
        title="Create Recipe"
        open={isModalOpen}
        onOk={handleCreateRecipe}
        onCancel={() => setIsModalOpen(false)}
        okText="Save Recipe"
        width={600}
      >
          <Form form={form} layout="vertical">
              <Form.Item name="menuItemId" label="Select Menu Item" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children">
                      {MOCK_MENU.map(m => (
                          <Option key={m.id} value={m.id}>{m.name}</Option>
                      ))}
                  </Select>
              </Form.Item>
              
              <Form.List name="ingredients" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex gap-2 items-end mb-2">
                        <Form.Item
                          {...restField}
                          name={[name, 'inventoryItemId']}
                          label={key === 0 ? "Ingredient" : ""}
                          className="flex-1 mb-0"
                          rules={[{ required: true, message: 'Missing ingredient' }]}
                        >
                          <Select placeholder="Select item">
                              {MOCK_INVENTORY.map(i => (
                                  <Option key={i.id} value={i.id}>{i.name}</Option>
                              ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          label={key === 0 ? "Qty" : ""}
                          className="w-24 mb-0"
                          rules={[{ required: true, message: 'Missing qty' }]}
                        >
                          <InputNumber min={0} placeholder="Qty" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'unit']}
                          label={key === 0 ? "Unit" : ""}
                          className="w-24 mb-0"
                          initialValue="kg"
                        >
                           <Select>
                               <Option value="kg">kg</Option>
                               <Option value="g">g</Option>
                               <Option value="l">l</Option>
                               <Option value="ml">ml</Option>
                               <Option value="pcs">pcs</Option>
                           </Select>
                        </Form.Item>
                        <Button type="text" danger onClick={() => remove(name)} className="mb-0">
                             <Plus className="rotate-45" size={20} />
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<Plus size={14} />}>
                        Add Ingredient
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
          </Form>
      </Modal>
    </div>
  );
};
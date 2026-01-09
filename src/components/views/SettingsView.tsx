import React from 'react';
import { Save, Globe, BellRing, Database, Printer, ToggleLeft, Percent, Lock } from 'lucide-react';
import { Switch, Divider, Tabs, Input, Select, Button, notification } from 'antd';

const { TabPane } = Tabs;

export const SettingsView: React.FC = () => {
  const handleSave = () => {
      notification.success({
          message: 'Settings Saved',
          description: 'Your configuration has been updated successfully.'
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">System Settings</h2>
            <p className="text-neutral-500 text-sm">Configure your outlet, hardware, and preferences</p>
         </div>
         <Button 
            type="primary" 
            icon={<Save size={16} />} 
            onClick={handleSave}
            className="bg-gold-500 text-black border-none hover:bg-gold-400 font-bold"
         >
            Save Changes
         </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl shadow-sm dark:shadow-none p-6">
         <Tabs defaultActiveKey="1" items={[
             {
                 key: '1',
                 label: (
                     <span className="flex items-center gap-2">
                         <Globe size={16} />
                         General
                     </span>
                 ),
                 children: (
                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Restaurant Name</label>
                                <Input defaultValue="BharPlate Outlet - MG Road" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Currency Symbol</label>
                                <Select defaultValue="INR" className="w-full">
                                    <Select.Option value="INR">INR (₹)</Select.Option>
                                    <Select.Option value="USD">USD ($)</Select.Option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Time Zone</label>
                                <Select defaultValue="IST" className="w-full">
                                    <Select.Option value="IST">India (GMT+5:30)</Select.Option>
                                    <Select.Option value="UTC">UTC</Select.Option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Contact Email</label>
                                <Input defaultValue="support@bharplate.com" />
                            </div>
                        </div>
                    </div>
                 )
             },
             {
                 key: '2',
                 label: (
                     <span className="flex items-center gap-2">
                         <Database size={16} />
                         Operations
                     </span>
                 ),
                 children: (
                    <div className="space-y-6 pt-4">
                        <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">Direct to Kitchen</h4>
                                    <p className="text-xs text-neutral-500">Automatically send orders to KDS without approval</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Divider className="my-2 border-neutral-200 dark:border-white/10" />
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">Token Creation</h4>
                                    <p className="text-xs text-neutral-500">Generate queue tokens for takeaway orders</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                             <Divider className="my-2 border-neutral-200 dark:border-white/10" />
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">Stock Reminders</h4>
                                    <p className="text-xs text-neutral-500">Alert when inventory drops below threshold</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>
                 )
             },
             {
                 key: '3',
                 label: (
                     <span className="flex items-center gap-2">
                         <Percent size={16} />
                         Taxes & Billing
                     </span>
                 ),
                 children: (
                    <div className="space-y-6 pt-4">
                        <div className="space-y-4">
                             <h4 className="font-bold text-neutral-900 dark:text-white mb-4">Tax Configuration</h4>
                             <div className="flex items-center gap-4">
                                 <div className="flex-1">
                                    <label className="text-xs text-neutral-500 uppercase font-bold mb-1 block">Tax Name</label>
                                    <Input defaultValue="GST" />
                                 </div>
                                 <div className="w-32">
                                     <label className="text-xs text-neutral-500 uppercase font-bold mb-1 block">Percentage</label>
                                     <Input type="number" defaultValue="5" suffix="%" />
                                 </div>
                             </div>
                             
                             <div className="flex items-center gap-4 mt-4">
                                 <div className="flex-1">
                                    <label className="text-xs text-neutral-500 uppercase font-bold mb-1 block">Service Charge</label>
                                    <Input defaultValue="Service Charge" />
                                 </div>
                                 <div className="w-32">
                                     <label className="text-xs text-neutral-500 uppercase font-bold mb-1 block">Percentage</label>
                                     <Input type="number" defaultValue="5" suffix="%" />
                                 </div>
                             </div>
                        </div>
                    </div>
                 )
             },
             {
                 key: '4',
                 label: (
                     <span className="flex items-center gap-2">
                         <Printer size={16} />
                         Printers
                     </span>
                 ),
                 children: (
                    <div className="space-y-6 pt-4">
                        <div className="p-4 border border-dashed border-neutral-300 dark:border-white/20 rounded-xl text-center">
                            <Printer className="mx-auto text-neutral-400 mb-2" size={32} />
                            <p className="text-neutral-500 mb-4">No KOT printers configured.</p>
                            <Button>Add Network Printer</Button>
                        </div>
                        <div className="flex justify-between items-center bg-neutral-50 dark:bg-white/5 p-4 rounded-xl">
                            <span className="text-neutral-900 dark:text-white font-medium">Auto-print Bill on Payment</span>
                            <Switch />
                        </div>
                    </div>
                 )
             }
         ]} />
      </div>
    </div>
  );
};
export default SettingsView;
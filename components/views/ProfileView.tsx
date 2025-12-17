import React from 'react';
import { User } from 'lucide-react';
import { Button, Input, Form, Divider } from 'antd';

export const ProfileView: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">My Profile</h2>
            
            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <User size={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Rajesh Sahu</h3>
                        <p className="text-neutral-500">Super Admin</p>
                        <Button type="link" className="p-0 h-auto text-gold-500">Change Avatar</Button>
                    </div>
                </div>

                <Form layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item label="Full Name">
                            <Input defaultValue="Rajesh Sahu" />
                        </Form.Item>
                        <Form.Item label="Email Address">
                            <Input defaultValue="rajesh@bharplate.com" disabled />
                        </Form.Item>
                        <Form.Item label="Phone Number">
                            <Input defaultValue="+91 98765 43210" />
                        </Form.Item>
                        <Form.Item label="Designation">
                            <Input defaultValue="Outlet Manager" />
                        </Form.Item>
                    </div>

                    <Divider className="border-neutral-200 dark:border-white/10" />

                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Security</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item label="Current Password">
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="New Password">
                            <Input.Password />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="primary" className="bg-gold-500 text-black border-none px-8">Save Changes</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
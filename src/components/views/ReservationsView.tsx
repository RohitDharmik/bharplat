import React, { useState } from 'react';
import { Reservation } from '../../types';
import { Calendar, Clock, Phone, Users, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, message } from 'antd';
import dayjs from 'dayjs';

export const ReservationsView: React.FC = () => {
  const { reservations, addReservation, isLoading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        // Combine date and time
        const datePart = values.date; // dayjs object
        const timePart = values.time; // dayjs object
        
        const fullDate = datePart
          .hour(timePart.hour())
          .minute(timePart.minute())
          .toDate();

        const newRes: Reservation = {
          id: `r${Date.now()}`,
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          guests: values.guests,
          date: fullDate,
          status: 'Pending'
        };

        await addReservation(newRes);
        messageApi.success('Reservation created successfully');
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Reservations</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Upcoming bookings and requests</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          New Reservation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget Placeholder */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-6 h-fit shadow-sm dark:shadow-none">
           <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
             <Calendar className="mr-2 text-gold-500" size={20} />
             {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
           </h3>
           <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center text-neutral-500 text-sm">
             [Calendar Component Placeholder]
           </div>
           <div className="mt-4 space-y-2">
             <div className="flex justify-between text-sm">
               <span className="text-neutral-500 dark:text-neutral-400">Total Bookings</span>
               <span className="text-neutral-900 dark:text-white font-medium">{reservations.length}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-neutral-500 dark:text-neutral-400">Expected Guests</span>
               <span className="text-neutral-900 dark:text-white font-medium">{reservations.reduce((acc, curr) => acc + curr.guests, 0)}</span>
             </div>
           </div>
        </div>

        {/* Reservations List */}
        <div className="lg:col-span-2 space-y-4">
          {reservations.map((res) => (
            <div key={res.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-gold-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                  ${res.status === 'Confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 
                    res.status === 'Pending' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20' : 
                    'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}
                `}>
                  {res.date.getDate()}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white text-lg">{res.customerName}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {res.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="flex items-center"><Users size={14} className="mr-1" /> {res.guests} Guests</span>
                    <span className="flex items-center"><Phone size={14} className="mr-1" /> {res.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {res.assignedTableId ? (
                   <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/5">
                     Table {res.assignedTableId.replace('t', '')}
                   </span>
                ) : (
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm text-yellow-600 dark:text-yellow-500/80 border border-yellow-500/20 animate-pulse">
                     Unassigned
                   </span>
                )}
                
                <div className="flex gap-2 ml-auto">
                  <button className="p-2 hover:bg-green-500/20 text-neutral-400 hover:text-green-500 transition-colors">
                    <CheckCircle size={20} />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 text-neutral-400 hover:text-red-500 transition-colors">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="New Reservation"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Create Reservation"
      >
        <Form
          form={form}
          layout="vertical"
          name="reservation_form"
          initialValues={{ guests: 2, date: dayjs(), time: dayjs() }}
        >
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true }]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
          </div>

          <Form.Item
            name="guests"
            label="Number of Guests"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus, Table } from '../../types';
import { Clock, CheckCircle, ChefHat, Bell, Package, FileText, Flame, Printer, Check, User as UserIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { notification } from 'antd';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, onUpdateStatus }) => {
  const { tables } = useAppStore();
  const [now, setNow] = useState(new Date());
  
  // Ref to track previous orders for new order detection
  const prevOrdersRef = useRef<Order[]>(orders);

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Effect to detect new orders and notify
  useEffect(() => {
    const prevOrders = prevOrdersRef.current;
    if (orders.length > prevOrders.length) {
      // Find newly added orders
      const newOrders = orders.filter(o => !prevOrders.find(po => po.id === o.id));
      
      newOrders.forEach(o => {
         const table = tables.find(t => t.id === o.tableId);
         const tableName = table?.name || o.tableId;
         
         notification.open({
             message: 'New Order Received',
             description: `Table: ${tableName} • ${o.items.length} items`,
             icon: <Bell className="text-red-500" />,
             placement: 'topRight',
             duration: 5,
             style: { borderLeft: '4px solid #ff4d4f' }
         });
      });
    }
    prevOrdersRef.current = orders;
  }, [orders, tables]);

  const getElapsedTime = (date: Date) => {
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  const isLate = (date: Date) => {
    const diffMins = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);
    return diffMins > 15;
  };

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const prepOrders = orders.filter(o => o.status === OrderStatus.PREPARING);
  const readyOrders = orders.filter(o => o.status === OrderStatus.READY);

  const getTableDetails = (tableId: string) => {
    return tables.find(t => t.id === tableId);
  };

  return (
    <div className="flex flex-col h-full lg:h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Station Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1E1E1E] border border-white/5 p-4 rounded-xl mb-6 shadow-lg gap-4">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-500/20 rounded-lg text-gold-500">
                    <ChefHat size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white leading-none">Grill Station</h2>
                    <p className="text-xs text-neutral-500 font-mono mt-1 tracking-wider uppercase">Shift: Dinner Service</p>
                </div>
            </div>
            <div className="hidden md:block h-8 w-px bg-white/10 mx-2"></div>
            <div className="hidden md:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-neutral-300">System Online</span>
            </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 rounded-lg font-medium transition-colors">
                <Package size={18} />
                <span>Request Supplies</span>
             </button>
             <button className="p-2.5 bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white rounded-lg relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1E1E1E] border-l-4 border-red-500 rounded-r-xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText size={60} />
             </div>
             <div>
                 <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">New Orders</p>
                 <span className="text-4xl font-bold text-white">{pendingOrders.length}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                <FileText size={20} />
             </div>
        </div>
        <div className="bg-[#1E1E1E] border-l-4 border-yellow-500 rounded-r-xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Flame size={60} />
             </div>
             <div>
                 <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">In Prep</p>
                 <span className="text-4xl font-bold text-white">{prepOrders.length}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                <Flame size={20} />
             </div>
        </div>
        <div className="bg-[#1E1E1E] border-l-4 border-green-500 rounded-r-xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle size={60} />
             </div>
             <div>
                 <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Ready</p>
                 <span className="text-4xl font-bold text-white">{readyOrders.length}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <Check size={20} />
             </div>
        </div>
      </div>

      {/* Kanban Board - Stack on Mobile, Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* New Orders Column */}
        <div className="flex flex-col min-h-[400px] lg:min-h-0 bg-neutral-900/30 rounded-xl p-2 lg:p-0">
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <h3 className="font-bold text-white">New Orders</h3>
                </div>
                <span className="bg-neutral-800 text-neutral-400 text-xs font-bold px-2 py-1 rounded">{pendingOrders.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar px-1">
                {pendingOrders.map(order => {
                    const table = getTableDetails(order.tableId);
                    const late = isLate(order.createdAt);
                    return (
                        <div key={order.id} className="bg-[#1E1E1E] border-l-4 border-red-500 rounded-r-xl p-4 shadow-lg group hover:bg-[#252525] transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xl font-bold text-white">{table?.name}</h4>
                                        {table?.zone === 'VIP' && <span className="bg-gold-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">VIP</span>}
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">#{order.id} • Server: Sarah</p>
                                </div>
                                <div className={`text-right ${late ? 'animate-pulse' : ''}`}>
                                    <div className={`flex items-center justify-end gap-1 font-mono font-bold ${late ? 'text-red-500' : 'text-neutral-400'}`}>
                                        <Clock size={14} />
                                        <span>{getElapsedTime(order.createdAt)}</span>
                                    </div>
                                    {late && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">LATE</span>}
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm">
                                        <div className="flex gap-3">
                                            <span className="bg-neutral-800 text-neutral-300 font-bold px-1.5 rounded h-fit">{item.quantity}x</span>
                                            <div>
                                                <span className="text-white font-medium">{item.name}</span>
                                                {item.notes && <p className="text-xs text-yellow-500/90 italic mt-0.5">+ {item.notes}</p>}
                                                {!item.notes && <p className="text-xs text-neutral-600 italic mt-0.5">+ No modifications</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-500/10"
                            >
                                <span>Start Preparing</span>
                                <Flame size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* In Prep Column */}
        <div className="flex flex-col min-h-[400px] lg:min-h-0 bg-neutral-900/30 rounded-xl p-2 lg:p-0">
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <h3 className="font-bold text-white">In Preparation</h3>
                </div>
                <span className="bg-neutral-800 text-neutral-400 text-xs font-bold px-2 py-1 rounded">{prepOrders.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar px-1">
                {prepOrders.map(order => {
                    const table = getTableDetails(order.tableId);
                    return (
                        <div key={order.id} className="bg-[#1E1E1E] border-l-4 border-yellow-500 rounded-r-xl p-4 shadow-lg">
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xl font-bold text-white">{table?.name}</h4>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">#{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 font-mono font-bold text-yellow-500">
                                        <Clock size={14} />
                                        <span>{getElapsedTime(order.createdAt)}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wide">COOKING</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-4 opacity-90">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm border-b border-dashed border-white/5 pb-2 last:border-0 last:pb-0">
                                        <div className="flex gap-3">
                                            <span className="bg-yellow-500/20 text-yellow-500 font-bold px-1.5 rounded h-fit">{item.quantity}x</span>
                                            <div>
                                                <span className="text-white font-medium">{item.name}</span>
                                                {item.notes && <p className="text-xs text-yellow-500/90 italic mt-0.5">+ {item.notes}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg transition-colors">
                                    <Printer size={20} />
                                </button>
                                <button 
                                    onClick={() => onUpdateStatus(order.id, OrderStatus.READY)}
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-600/10"
                                >
                                    <span>Mark Ready</span>
                                    <Check size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col min-h-[400px] lg:min-h-0 bg-neutral-900/30 rounded-xl p-2 lg:p-0 mb-6 lg:mb-0">
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <h3 className="font-bold text-white">Ready for Pickup</h3>
                </div>
                <span className="bg-neutral-800 text-neutral-400 text-xs font-bold px-2 py-1 rounded">{readyOrders.length}</span>
            </div>
             <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar px-1">
                {readyOrders.map(order => {
                    const table = getTableDetails(order.tableId);
                    return (
                        <div key={order.id} className="bg-[#1E1E1E] border-l-4 border-green-500 rounded-r-xl p-4 shadow-lg opacity-80 hover:opacity-100 transition-opacity">
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xl font-bold text-white">{table?.name}</h4>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">#{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 font-mono font-bold text-green-500">
                                        <CheckCircle size={14} />
                                        <span>{getElapsedTime(order.createdAt)}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">WAITING</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm flex gap-3 text-neutral-400">
                                        <span>{item.quantity}x</span>
                                        <span className="line-through decoration-green-500/50">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onUpdateStatus(order.id, OrderStatus.SERVED)}
                                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/5"
                            >
                                <span>Picked Up</span>
                                <Check size={16} className="text-green-500" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { MOCK_MENU, INITIAL_TABLES } from '../../constants';
import { OrderItem, MenuItem } from '../../types';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, CheckCircle, AlertCircle, Search, UtensilsCrossed, X, FileText } from 'lucide-react';
import { Modal, Button, Input, Divider } from 'antd';

interface NewOrderViewProps {
  onPlaceOrder: (tableId: string, items: OrderItem[]) => void;
  initialTableId?: string;
}

export const NewOrderView: React.FC<NewOrderViewProps> = ({ onPlaceOrder, initialTableId }) => {
  const [selectedTable, setSelectedTable] = useState<string>(initialTableId || '');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderLevelNote, setOrderLevelNote] = useState('');

  // Update selected table if initialTableId changes
  useEffect(() => {
    if (initialTableId) {
      setSelectedTable(initialTableId);
    }
  }, [initialTableId]);

  const categories = ['All', 'Starter', 'Main', 'Dessert', 'Drink'];
  
  const filteredMenu = MOCK_MENU.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.menuItemId === itemId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const updateNote = (itemId: string, note: string) => {
    setCart(prev => prev.map(i => {
      if (i.menuItemId === itemId) {
        return { ...i, notes: note };
      }
      return i;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleInitiateOrder = () => {
    if (selectedTable && cart.length > 0) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmOrder = () => {
    if (selectedTable && cart.length > 0) {
      // Inject order level note into the first item or handle separately in backend (mocking here)
      // For simplicity in this mock, we assume the backend handles order-level notes, 
      // but passing it as a "Special Instruction" item or logging it is common.
      console.log("Order Note:", orderLevelNote);
      
      onPlaceOrder(selectedTable, cart);
      setCart([]);
      setOrderLevelNote('');
      if (!initialTableId) {
        setSelectedTable('');
      }
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0 relative">
      {/* Left Panel: Menu Selection */}
      <div className="flex-1 flex flex-col min-h-[500px] bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Top Toolbar */}
        <div className="p-4 border-b border-neutral-200 dark:border-white/5 space-y-4">
            {/* Table Selector */}
            <div className="overflow-x-auto pb-2 no-scrollbar">
                <div className="flex gap-2">
                    {INITIAL_TABLES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTable(t.id)}
                        className={`
                        px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2
                        ${selectedTable === t.id 
                            ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20 scale-105' 
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}
                        `}
                    >
                        <span>{t.name}</span>
                        {selectedTable === t.id && <CheckCircle size={14} />}
                    </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search menu items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-gold-500/50 outline-none transition-colors"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                        ${activeCategory === cat 
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-black' 
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5'}
                    `}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filteredMenu.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 opacity-60">
                  <UtensilsCrossed size={48} className="mb-4" />
                  <p>No items found</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMenu.map(item => (
                <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 dark:border-white/5 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all group text-left bg-neutral-50 dark:bg-white/5"
                >
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-neutral-200 dark:bg-neutral-800 shadow-sm" />
                    <div className="flex flex-col justify-between flex-1 min-h-[80px]">
                        <div>
                            <h4 className="font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{item.name}</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-neutral-900 dark:text-white">₹{item.price}</span>
                            <div className="w-7 h-7 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-gold-500 group-hover:text-black transition-all shadow-sm">
                                <Plus size={16} />
                            </div>
                        </div>
                    </div>
                </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Cart Sidebar - Mobile Optimized */}
      <div className={`
         w-full lg:w-[400px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 rounded-2xl flex flex-col shadow-xl overflow-hidden
         fixed lg:static bottom-0 left-0 z-40 lg:z-auto h-[60vh] lg:h-auto
         transform transition-transform duration-300
         ${cart.length > 0 ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        {/* Mobile Pull Handle */}
        <div className="lg:hidden w-full flex justify-center pt-2 pb-1 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-white/5 rounded-t-2xl">
           <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
        </div>

        <div className="p-5 border-b border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="text-gold-500" size={20} />
                Current Order
            </h3>
            <span className="bg-gold-500/10 text-gold-600 text-xs font-bold px-2 py-1 rounded">
                {totalItems} Items
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Table: <span className="text-neutral-900 dark:text-white font-bold">{selectedTable ? INITIAL_TABLES.find(t => t.id === selectedTable)?.name : 'None Selected'}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <ShoppingBag size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold text-neutral-600 dark:text-neutral-300">Basket is empty</p>
                <p className="text-sm">Select items from the menu to start</p>
              </div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.menuItemId} className="bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-200 dark:border-white/5 group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-neutral-900 dark:text-white text-sm">{item.name}</p>
                    <p className="text-xs text-gold-600 dark:text-gold-500 font-mono mt-0.5">₹{item.price * item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.menuItemId)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <X size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                    <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => updateNote(item.menuItemId, e.target.value)}
                        placeholder="Add note..."
                        className="flex-1 bg-white dark:bg-black/20 border-none rounded px-2 py-1 text-xs text-neutral-600 dark:text-neutral-300 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all mr-3"
                    />
                    <div className="flex items-center bg-white dark:bg-neutral-900 rounded-lg p-1 shadow-sm border border-neutral-200 dark:border-white/10">
                        <button onClick={() => updateQuantity(item.menuItemId, -1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded text-neutral-500"><Minus size={12} /></button>
                        <span className="w-6 text-center text-xs font-bold text-neutral-900 dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.menuItemId, 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded text-neutral-500"><Plus size={12} /></button>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-white/5 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="space-y-2">
             <div className="flex justify-between text-sm text-neutral-500">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm text-neutral-500">
                <span>Taxes (5%)</span>
                <span>₹{(total * 0.05).toFixed(2)}</span>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-dashed border-neutral-200 dark:border-white/10">
                <span className="font-bold text-lg text-neutral-900 dark:text-white">Total</span>
                <span className="font-bold text-xl text-gold-600">₹{(total * 1.05).toFixed(2)}</span>
             </div>
          </div>
          
          <button 
            disabled={!selectedTable || cart.length === 0}
            onClick={handleInitiateOrder}
            className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold-500/20 active:scale-95"
          >
            Review & Place Order
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Floating View Cart Button for Mobile (When panel is hidden but has items) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-6">
        {cart.length > 0 && (
           <div className="bg-gold-500 text-black py-3 px-6 rounded-full shadow-lg font-bold flex items-center justify-between animate-in slide-in-from-bottom-10">
               <span>{totalItems} Items</span>
               <div className="flex items-center gap-2">
                   <span>View Cart</span>
                   <ShoppingBag size={18} />
               </div>
               <span>₹{total.toFixed(2)}</span>
           </div>
        )}
      </div>

      {/* Captain's Order Summary Modal */}
      <Modal
        title={
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-white/5">
                <FileText className="text-gold-500" size={20} />
                <span className="text-xl font-bold">Order Summary</span>
            </div>
        }
        open={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        width={600}
        footer={[
          <Button key="back" size="large" onClick={() => setIsConfirmOpen(false)} className="rounded-xl">
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            size="large"
            className="bg-gold-500 hover:bg-gold-400 text-black border-none font-bold px-8 rounded-xl" 
            onClick={handleConfirmOrder}
          >
            Confirm KOT
          </Button>,
        ]}
        className="captain-summary-modal"
      >
        <div className="py-4 space-y-6">
          {/* Table Details */}
          <div className="flex justify-between items-center bg-neutral-50 dark:bg-white/5 p-4 rounded-xl border border-neutral-200 dark:border-white/10">
             <div>
                 <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Table</p>
                 <p className="text-lg font-bold text-neutral-900 dark:text-white">{INITIAL_TABLES.find(t => t.id === selectedTable)?.name}</p>
             </div>
             <div className="text-right">
                 <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Total Items</p>
                 <p className="text-lg font-bold text-neutral-900 dark:text-white">{totalItems}</p>
             </div>
             <div className="text-right">
                 <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">Total Amount</p>
                 <p className="text-lg font-bold text-gold-600">₹{total.toFixed(2)}</p>
             </div>
          </div>

          {/* Items List */}
          <div>
              <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wide mb-3">Items to Kitchen</h4>
              <div className="border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                 {cart.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-start p-3 border-b border-neutral-100 dark:border-white/5 last:border-0 bg-white dark:bg-neutral-900">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm">
                             {item.quantity}x
                         </div>
                         <div>
                             <p className="font-bold text-neutral-900 dark:text-white text-sm">{item.name}</p>
                             {item.notes && (
                                 <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-0.5">
                                     <AlertCircle size={10} /> {item.notes}
                                 </p>
                             )}
                         </div>
                      </div>
                      <span className="font-medium text-neutral-500 text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
              </div>
          </div>

          {/* Order Level Note */}
          <div>
               <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wide mb-2">Order Notes</h4>
               <Input.TextArea 
                    placeholder="Any special instructions for the chef? (e.g. Rush order, Allergies)" 
                    rows={2}
                    value={orderLevelNote}
                    onChange={(e) => setOrderLevelNote(e.target.value)}
                    className="rounded-xl"
               />
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 dark:bg-white/5 p-3 rounded-lg">
             <CheckCircle size={14} className="text-green-500" />
             <p>This will generate KOT #8923 and send to Kitchen Display System.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
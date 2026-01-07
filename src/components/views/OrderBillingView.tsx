import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { OrderItem, MenuItem, OrderStatus, OrderType, DiscountType, Table, Order, KOT } from '../../types';
import {
  Search, ShoppingBag, Minus, Plus, Trash2, Save, FileText, Printer,
  CreditCard, Split, Gift, IndianRupee, Percent, CheckCircle, X,
  UtensilsCrossed, Clock, Check, AlertCircle
} from 'lucide-react';

interface OrderBillingViewProps {
  initialOrderId?: string;
  initialTableId?: string;
}

export const OrderBillingView: React.FC<OrderBillingViewProps> = ({
  initialOrderId,
  initialTableId
}) => {
  const { menu, tables, orders, kots, placeOrder, updateOrderStatus, generateKOT } = useAppStore();

  // State for current order
  const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({
    items: [],
    status: OrderStatus.ORDERED,
    orderType: OrderType.DINE_IN,
    subtotal: 0,
    gstRate: 5,
    gstAmount: 0,
    totalAmount: 0,
    discount: undefined,
    isComplimentary: false,
    advancePayment: 0
  });

  // UI state
  const [selectedTable, setSelectedTable] = useState<string>(initialTableId || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState<number>(0);
  const [splitBillType, setSplitBillType] = useState<'equal' | 'custom' | 'items'>('equal');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);

  // Discount state
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.PERCENTAGE);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');

  // Load existing order if editing
  useEffect(() => {
    if (initialOrderId) {
      const existingOrder = orders.find(o => o.id === initialOrderId);
      if (existingOrder) {
        setCurrentOrder(existingOrder);
        setSelectedTable(existingOrder.tableId || '');
      }
    }
  }, [initialOrderId, orders]);

  const categories = ['All', 'Starter', 'Main', 'Dessert', 'Drink'];

  // Filter menu based on category and search
  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  // Calculate totals
  const calculateTotals = (items: OrderItem[], discount?: any) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = (subtotal * (currentOrder.gstRate || 5)) / 100;
    let discountAmount = 0;

    if (discount) {
      if (discount.type === DiscountType.PERCENTAGE) {
        discountAmount = (subtotal * discount.value) / 100;
      } else {
        discountAmount = discount.value;
      }
    }

    const totalAmount = subtotal + gstAmount - discountAmount;

    return { subtotal, gstAmount, discountAmount, totalAmount };
  };

  // Add item to order
  const addToCart = (item: MenuItem) => {
    const items = currentOrder.items || [];
    const existing = items.find(i => i.menuItemId === item.id);

    let newItems: OrderItem[];
    if (existing) {
      newItems = items.map(i =>
        i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...items, {
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        price: item.price
      }];
    }

    const totals = calculateTotals(newItems, currentOrder.discount);
    setCurrentOrder(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  // Update item quantity
  const updateQuantity = (itemId: string, delta: number) => {
    const items = currentOrder.items || [];
    const newItems = items.map(i => {
      if (i.menuItemId === itemId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }).filter(i => i.quantity > 0);

    const totals = calculateTotals(newItems, currentOrder.discount);
    setCurrentOrder(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  // Remove item from order
  const removeItem = (itemId: string) => {
    const items = currentOrder.items || [];
    const newItems = items.filter(i => i.menuItemId !== itemId);

    const totals = calculateTotals(newItems, currentOrder.discount);
    setCurrentOrder(prev => ({
      ...prev,
      items: newItems,
      ...totals
    }));
  };

  // Apply discount
  const applyDiscount = () => {
    const discount = {
      type: discountType,
      value: discountValue,
      reason: discountReason
    };

    const totals = calculateTotals(currentOrder.items || [], discount);
    setCurrentOrder(prev => ({
      ...prev,
      discount,
      ...totals
    }));
    setShowDiscountModal(false);
  };

  // Save order
  const handleSaveOrder = async () => {
    if (!currentOrder.items?.length) return;

    // Business logic validation
    if (currentOrder.orderType === OrderType.DINE_IN && !selectedTable) {
      alert('Please select a table for dine-in orders');
      return;
    }

    try {
      await placeOrder(selectedTable || '', currentOrder.items || []);
      // Reset form after successful save
      setCurrentOrder({
        items: [],
        status: OrderStatus.ORDERED,
        orderType: OrderType.DINE_IN,
        subtotal: 0,
        gstRate: 5,
        gstAmount: 0,
        totalAmount: 0,
        discount: undefined,
        isComplimentary: false,
        advancePayment: 0
      });
      setSelectedTable('');
      alert('Order saved successfully!');
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  // Generate KOT
  const handleGenerateKOT = async () => {
    if (!currentOrder.items?.length) return;

    // Separate food and beverage items
    const foodItems = currentOrder.items.filter(item => {
      const menuItem = menu.find(m => m.id === item.menuItemId);
      return menuItem?.category !== 'Drink';
    });

    const beverageItems = currentOrder.items.filter(item => {
      const menuItem = menu.find(m => m.id === item.menuItemId);
      return menuItem?.category === 'Drink';
    });

    // Generate KOTs for each area
    if (foodItems.length > 0) {
      await generateKOT('temp-order-id', foodItems, 'Food');
    }
    if (beverageItems.length > 0) {
      await generateKOT('temp-order-id', beverageItems, 'Beverage');
    }
  };

  // Print KOT
  const handlePrintKOT = () => {
    // Mock print functionality
    const printContent = `
KOT - Order Summary
==================
${currentOrder.items?.map(item => `${item.quantity}x ${item.name}`).join('\n')}

Total Items: ${currentOrder.items?.reduce((sum, item) => sum + item.quantity, 0)}
Time: ${new Date().toLocaleTimeString()}
    `.trim();

    console.log('Printing KOT:', printContent);
    // In real implementation, this would send to printer
    alert('KOT sent to printer!');
  };

  // Print Bill
  const handlePrintBill = () => {
    // Mock print functionality
    const printContent = `
BILL SUMMARY
============
${currentOrder.items?.map(item => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: ₹${currentOrder.subtotal?.toFixed(2)}
GST (${currentOrder.gstRate}%): ₹${currentOrder.gstAmount?.toFixed(2)}
${currentOrder.discount ? `Discount: -₹${(currentOrder.discount.type === DiscountType.PERCENTAGE ? (currentOrder.subtotal || 0) * currentOrder.discount.value / 100 : currentOrder.discount.value).toFixed(2)}` : ''}
Total: ₹${currentOrder.totalAmount?.toFixed(2)}

Thank you for dining with us!
    `.trim();

    console.log('Printing Bill:', printContent);
    // In real implementation, this would send to printer
    alert('Bill sent to printer!');
  };

  // Proceed to Payment
  const handleProceedToPayment = async () => {
    if (!currentOrder.items?.length) return;

    try {
      // In real implementation, this would open payment modal or redirect to payment page
      const confirmed = confirm(`Proceed to payment of ₹${currentOrder.totalAmount?.toFixed(2)}?`);
      if (confirmed) {
        // Update order status to COMPLETED
        if (currentOrder.id) {
          await updateOrderStatus(currentOrder.id, OrderStatus.COMPLETED);
        }
        alert('Payment processed successfully!');
        // Reset form
        setCurrentOrder({
          items: [],
          status: OrderStatus.ORDERED,
          orderType: OrderType.DINE_IN,
          subtotal: 0,
          gstRate: 5,
          gstAmount: 0,
          totalAmount: 0,
          discount: undefined,
          isComplimentary: false,
          advancePayment: 0
        });
        setSelectedTable('');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-white/10 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-gold-500/50 outline-none"
            />
          </div>

          {/* Order Status Dropdown */}
          <select
            value={currentOrder.status}
            onChange={(e) => setCurrentOrder(prev => ({ ...prev, status: e.target.value as OrderStatus }))}
            className="bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-gold-500/50 outline-none"
          >
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Table Selector */}
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-gold-500/50 outline-none"
          >
            <option value="">Select Table</option>
            {tables.filter(t => t.status === 'Available').map(table => (
              <option key={table.id} value={table.id}>{table.name}</option>
            ))}
          </select>

          {/* Order Type Selector */}
          <div className="flex gap-2">
            {Object.values(OrderType).map(type => (
              <button
                key={type}
                onClick={() => setCurrentOrder(prev => ({ ...prev, orderType: type }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentOrder.orderType === type
                    ? 'bg-gold-500 text-black'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Menu Selection Panel */}
        <div className="w-1/2 flex flex-col border-r border-neutral-200 dark:border-white/10">
          {/* Category Tabs */}
          <div className="p-4 border-b border-neutral-200 dark:border-white/10">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredMenu.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                <UtensilsCrossed size={48} className="mb-4" />
                <p>No items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredMenu.map(item => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200 dark:border-white/5 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all group text-left bg-white dark:bg-white/5"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex-1 min-h-[64px]">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-neutral-900 dark:text-white">₹{item.price}</span>
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-gold-500 group-hover:text-black transition-all">
                          <Plus size={14} />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary & Billing Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Order Summary */}
          <div className="flex-1 p-4 border-b border-neutral-200 dark:border-white/10">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="text-gold-500" size={20} />
              Order Summary
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentOrder.items?.length === 0 ? (
                <div className="text-center text-neutral-400 py-8">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No items added yet</p>
                </div>
              ) : (
                currentOrder.items?.map(item => (
                  <div key={item.menuItemId} className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-neutral-900 dark:text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gold-600 dark:text-gold-500">₹{item.price * item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        placeholder="Add note..."
                        className="flex-1 bg-neutral-50 dark:bg-black/20 border-none rounded px-2 py-1 text-xs focus:ring-1 focus:ring-gold-500/50 outline-none"
                      />
                      <div className="flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1 ml-3">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Billing Actions & Summary */}
          <div className="p-4 space-y-4">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSaveOrder}
                disabled={!currentOrder.items?.length}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 px-4 rounded-xl text-sm font-medium"
              >
                <Save size={16} />
                Save Order
              </button>
              <button
                onClick={handleGenerateKOT}
                disabled={!currentOrder.items?.length}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 px-4 rounded-xl text-sm font-medium"
              >
                <FileText size={16} />
                Generate KOT
              </button>
              <button
                onClick={handlePrintKOT}
                disabled={!currentOrder.items?.length}
                className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white py-2 px-4 rounded-xl text-sm font-medium"
              >
                <Printer size={16} />
                Print KOT
              </button>
              <button
                onClick={handlePrintBill}
                disabled={!currentOrder.items?.length}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2 px-4 rounded-xl text-sm font-medium"
              >
                <Printer size={16} />
                Print Bill
              </button>
            </div>

            {/* Toggle Options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowSplitBill(true)}
                className="flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 py-2 px-4 rounded-xl text-sm"
              >
                <Split size={16} />
                Split Bill
              </button>
              <button
                onClick={() => setCurrentOrder(prev => ({ ...prev, isComplimentary: !prev.isComplimentary }))}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium ${
                  currentOrder.isComplimentary
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Gift size={16} />
                Complimentary
              </button>
              <button
                onClick={() => setShowAdvancePayment(true)}
                className="flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 py-2 px-4 rounded-xl text-sm"
              >
                <IndianRupee size={16} />
                Advance Payment
              </button>
              <button
                onClick={() => setShowDiscountModal(true)}
                className="flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 py-2 px-4 rounded-xl text-sm"
              >
                <Percent size={16} />
                Discount
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-white/5">
              <h4 className="font-bold text-neutral-900 dark:text-white mb-3">Bill Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                  <span className="font-medium">₹{currentOrder.subtotal?.toFixed(2)}</span>
                </div>
                {currentOrder.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({currentOrder.discount.type})</span>
                    <span>-₹{((currentOrder.discount.type === DiscountType.PERCENTAGE
                      ? (currentOrder.subtotal || 0) * currentOrder.discount.value / 100
                      : currentOrder.discount.value)).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">GST ({currentOrder.gstRate}%)</span>
                  <span className="font-medium">₹{currentOrder.gstAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-white/10">
                  <span className="font-bold text-neutral-900 dark:text-white">Total</span>
                  <span className="font-bold text-gold-600">₹{currentOrder.totalAmount?.toFixed(2)}</span>
                </div>
                {currentOrder.advancePayment && currentOrder.advancePayment > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Advance Paid</span>
                    <span>-₹{currentOrder.advancePayment.toFixed(2)}</span>
                  </div>
                )}
                {currentOrder.advancePayment && currentOrder.advancePayment > 0 && (
                  <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-white/10">
                    <span className="font-bold text-neutral-900 dark:text-white">Balance Due</span>
                    <span className="font-bold text-red-600">₹{((currentOrder.totalAmount || 0) - currentOrder.advancePayment).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Proceed to Payment */}
            <button
              onClick={handleProceedToPayment}
              disabled={!currentOrder.items?.length}
              className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Apply Discount</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Discount Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiscountType(DiscountType.PERCENTAGE)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm ${
                      discountType === DiscountType.PERCENTAGE
                        ? 'bg-gold-500 text-black'
                        : 'bg-neutral-100 dark:bg-neutral-700'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    onClick={() => setDiscountType(DiscountType.FLAT)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm ${
                      discountType === DiscountType.FLAT
                        ? 'bg-gold-500 text-black'
                        : 'bg-neutral-100 dark:bg-neutral-700'
                    }`}
                  >
                    Flat Amount (₹)
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {discountType === DiscountType.PERCENTAGE ? 'Percentage' : 'Amount'}
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2"
                  placeholder={discountType === DiscountType.PERCENTAGE ? '10' : '50'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2"
                  placeholder="Manager approval, loyalty discount, etc."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="flex-1 bg-neutral-100 dark:bg-neutral-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={applyDiscount}
                className="flex-1 bg-gold-500 text-black py-2 rounded-lg font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advance Payment Modal */}
      {showAdvancePayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Advance Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={advancePaymentAmount}
                  onChange={(e) => setAdvancePaymentAmount(Number(e.target.value))}
                  className="w-full bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2"
                  placeholder="Enter advance amount"
                  max={currentOrder.totalAmount}
                />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Total Bill: ₹{currentOrder.totalAmount?.toFixed(2)}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAdvancePayment(false)}
                className="flex-1 bg-neutral-100 dark:bg-neutral-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCurrentOrder(prev => ({ ...prev, advancePayment: advancePaymentAmount }));
                  setShowAdvancePayment(false);
                }}
                className="flex-1 bg-gold-500 text-black py-2 rounded-lg font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Bill Modal */}
      {showSplitBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Split Bill</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Split Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSplitBillType('equal')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm ${
                      splitBillType === 'equal'
                        ? 'bg-gold-500 text-black'
                        : 'bg-neutral-100 dark:bg-neutral-700'
                    }`}
                  >
                    Equal Split
                  </button>
                  <button
                    onClick={() => setSplitBillType('custom')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm ${
                      splitBillType === 'custom'
                        ? 'bg-gold-500 text-black'
                        : 'bg-neutral-100 dark:bg-neutral-700'
                    }`}
                  >
                    Custom Amount
                  </button>
                </div>
              </div>

              {splitBillType === 'equal' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Number of People</label>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                    className="w-full bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2"
                    min="2"
                    max="10"
                  />
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                    Each person pays: ₹{((currentOrder.totalAmount || 0) / numberOfPeople).toFixed(2)}
                  </div>
                </div>
              )}

              {splitBillType === 'custom' && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Custom split functionality would allow individual amount assignment per person.
                  (Implementation pending)
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSplitBill(false)}
                className="flex-1 bg-neutral-100 dark:bg-neutral-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle split bill logic here
                  console.log('Splitting bill:', { type: splitBillType, people: numberOfPeople });
                  setShowSplitBill(false);
                }}
                className="flex-1 bg-gold-500 text-black py-2 rounded-lg font-medium"
              >
                Split Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState } from "react";
import { Order, OrderStatus, Table, MenuItem } from "../../types";
import {
  CreditCard,
  Wallet,
  Banknote,
  Landmark,
  Check,
  ArrowLeft,
  Tag,
  Pencil,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface PaymentsViewProps {
  orders: Order[];
  tables: Table[];
  onProcessPayment: (orderId: string) => void;
}
const CheckCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" />
    <path
      d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PaymentsView: React.FC<PaymentsViewProps> = ({
  orders,
  tables,
  onProcessPayment,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { menu } = useAppStore();

  // Get unpaid orders that are served or ready
  const unpaidOrders = orders.filter(
    (item) =>
      item.status !== OrderStatus.PAID && item.status !== OrderStatus.PENDING
  );

  // Constants for calculation
  const TAX_RATE = 0.05; // 5% GST for restaurants
  const SERVICE_CHARGE_RATE = 0.05;

  const selectedOrder = selectedOrderId
    ? unpaidOrders.find((item) => item.id === selectedOrderId)
    : null;
  const selectedTable = selectedOrder
    ? tables.find((t) => t.id === selectedOrder.tableId)
    : null;

  const getItemImage = (menuItemId: string) => {
    return (
      menu.find((m) => m.id === menuItemId)?.image ||
      "https://picsum.photos/200/200"
    );
  };

  const getItemDescription = (menuItemId: string) => {
    return menu.find((m) => m.id === menuItemId)?.category || "Item";
  };

  if (selectedOrder && selectedTable) {
    const subtotal = selectedOrder.totalAmount;
    const tax = subtotal * TAX_RATE;
    const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
    const totalDue = subtotal + tax + serviceCharge;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
              <span>Tables</span>
              <ChevronRight size={14} />
              <span>Checkout</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {selectedTable.name}
            </h2>
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <span className="text-gold-500">Order #{selectedOrder.id}</span>
              <span>•</span>
              <span>Server: Priya Verma</span>
              <span>•</span>
              <span>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrderId(null)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors border border-white/5"
          >
            <ArrowLeft size={16} />
            <span>Back to Tables</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-500/10 rounded-lg text-gold-500">
                    <Tag size={20} />
                  </div>
                  <h3 className="font-bold text-white text-lg">
                    Order Summary
                  </h3>
                </div>
                <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20">
                  UNPAID
                </span>
              </div>

              <div className="p-6">
                {/* Table Header */}
                <div className="grid grid-cols-12 text-xs text-neutral-500 uppercase font-semibold mb-4 px-2">
                  <div className="col-span-6">Item Name</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-2 transition-colors group"
                    >
                      <div className="col-span-6 flex items-center gap-4">
                        <img
                          src={getItemImage(item.menuItemId)}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-800 shadow-md"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {item.notes || getItemDescription(item.menuItemId)}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center text-white font-medium">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right text-neutral-400 text-sm">
                        ₹{item.price.toFixed(2)}
                      </div>
                      <div className="col-span-2 text-right text-white font-bold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-black/20 border-t border-white/5 text-right">
                <button className="text-sm text-neutral-400 hover:text-white flex items-center justify-end gap-2 w-full transition-colors">
                  <Pencil size={14} />
                  Modify Order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-[#1E1E1E] border-2 border-gold-500 rounded-xl flex flex-col items-center justify-center gap-2 text-gold-500 shadow-lg shadow-gold-500/10 relative">
                  <div className="absolute top-2 right-2 text-gold-500">
                    <CheckCircleIcon />
                  </div>
                  <CreditCard size={24} />
                  <span className="text-sm font-bold">Credit/Debit Card</span>
                </button>
                <button className="p-4 bg-[#1E1E1E] border border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-all">
                  <Banknote size={24} />
                  <span className="text-sm font-medium">Cash</span>
                </button>
                <button className="p-4 bg-[#1E1E1E] border border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-all">
                  <Landmark size={24} />
                  <span className="text-sm font-medium">UPI / QR</span>
                </button>
                <button className="p-4 bg-[#1E1E1E] border border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-all">
                  <Wallet size={24} />
                  <span className="text-sm font-medium">Wallet</span>
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 font-bold uppercase mb-1.5 block tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-neutral-700 focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 font-bold uppercase mb-1.5 block tracking-wider">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-neutral-700 focus:border-gold-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 font-bold uppercase mb-1.5 block tracking-wider">
                    CVC
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-neutral-700 focus:border-gold-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="text-xs text-neutral-500 font-bold uppercase mb-1.5 block tracking-wider">
                Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 bg-[#121212] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-neutral-700 focus:border-gold-500 focus:outline-none transition-colors"
                />
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 rounded-lg font-medium transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <hr className="border-white/5 my-6" />

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-400 text-sm">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-sm">
                <span>GST (5%)</span>
                <span className="text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-sm">
                <span>Service Charge (5%)</span>
                <span className="text-white">₹{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <div>
                  <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider block mb-1">
                    Total Amount Due
                  </span>
                  <span className="text-xs text-neutral-600">
                    Includes all taxes
                  </span>
                </div>
                <span className="text-4xl font-black text-gold-500">
                  ₹{totalDue.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onProcessPayment(selectedOrder.id)}
              className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 rounded-xl text-lg shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all flex items-center justify-center gap-2 group"
            >
              Process Payment
              <ArrowLeft
                className="rotate-180 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default List View
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Active Bills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unpaidOrders.length === 0 && (
          <div className="col-span-full p-12 text-center text-neutral-500 bg-neutral-900/30 rounded-xl border border-dashed border-white/10">
            <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active bills to settle.</p>
          </div>
        )}

        {unpaidOrders.map((order) => {
          const table = tables.find((t) => t.id === order.tableId);
          return (
            <button
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className="bg-neutral-900/60 border border-white/5 rounded-xl overflow-hidden flex flex-col text-left group hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
            >
              <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center w-full">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-gold-500 transition-colors">
                    {table?.name || "Unknown Table"}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Order #{order.id}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold-400">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 w-full">
                <ul className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-neutral-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-neutral-500">
                        ₹{item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                  {order.items.length > 3 && (
                    <li className="text-xs text-neutral-500 italic">
                      + {order.items.length - 3} more items
                    </li>
                  )}
                </ul>
                <div className="border-t border-white/5 pt-2 flex justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Check size={12} /> Ready for Payment
                  </span>
                  <span>Tap to Checkout &rarr;</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default PaymentsView;

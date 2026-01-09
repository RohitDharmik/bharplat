import React, { useState, useEffect, useMemo } from "react";
import { useAppStore } from "../../../store/useAppStore";
import { Modal, message } from "antd";
import { ArrowRight, CreditCard } from "lucide-react";
import { OrderItem, MenuItem } from "../../../types";
import { CategoryAccordion } from "./CategoryAccordion";
import { CartButton } from "./CartButton";
import { CategoryTabs } from "./CategoryTabs";
import { useBreakpoint } from "../../../hooks/useResponsive";
import { ResponsiveContainer } from "../../ui/ResponsiveGrid";
import { QuantityControl, PriceDisplay } from "../../ui/Controls";
import { useGroupedData } from "../../../hooks/useMemoizedData";

// Helper function to scroll to menu area on small screens
const scrollToMenuArea = () => {
  window.scrollTo({ top: 140, behavior: "smooth" });
};

export const GuestMenu: React.FC = () => {
  const { menu, placeOrder, guestTableId, tables } = useAppStore();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { isMobile, isTablet } = useBreakpoint();

  // Memoize grouped menu data for performance
  const groupedMenu = useGroupedData(
    menu,
    (item) => item.category,
    [menu]
  );

  // Memoize categories for performance
  const categories = useMemo(() => ["All", "Starter", "Main", "Dessert", "Drink"], []);
  const table = tables.find((t) => t.id === guestTableId);

  // Scroll to menu area on component mount for small screens
  useEffect(() => {
    if (isMobile || isTablet) {
      scrollToMenuArea();
    }
  }, [isMobile, isTablet]);

  // Scroll to menu area when category changes on small screens
  useEffect(() => {
    if (isMobile || isTablet) {
      scrollToMenuArea();
    }
  }, [activeCategory, isMobile, isTablet]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        messageApi.info(`Added another ${item.name}`);
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      messageApi.success(`Added ${item.name} to order`);
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.menuItemId === itemId)
          return { ...i, quantity: Math.max(1, i.quantity + delta) };
        return i;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== itemId));
  };

  const handlePlaceOrder = async () => {
    if (!guestTableId || cart.length === 0) return;
    await placeOrder(guestTableId, cart);
    setCart([]);
    setIsCartOpen(false);
    Modal.success({
      title: "Order Placed!",
      content:
        'Your order has been sent to the kitchen. You can track it in "My Bill".',
      centered: true,
      okButtonProps: {
        className: "bg-gold-500 text-black border-none hover:bg-gold-400",
      },
    });
  };

  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0), 
    [cart]
  );

  return (
    <ResponsiveContainer maxWidth="5xl" padding={false}>
      {contextHolder}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Menu
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          {table?.name}
        </p>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Menu Accordion */}
      <CategoryAccordion
        categories={categories}
        menu={menu}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onAddToCart={addToCart}
      />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <CartButton
          itemCount={cart.reduce((a, b) => a + b.quantity, 0)}
          total={total}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Cart Modal */}
      <Modal
        title={<span className="text-xl font-bold">Your Selection</span>}
        open={isCartOpen}
        onCancel={() => setIsCartOpen(false)}
        footer={null}
        centered
        width={isMobile ? "95%" : 500}
        className="cart-modal"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map((item) => (
            <div
              key={item.menuItemId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-neutral-100 dark:border-white/5"
            >
              <div className="flex-1">
                <h4 className="font-bold text-neutral-900 dark:text-white">{item.name}</h4>
                <PriceDisplay price={item.price * item.quantity} size="sm" />
              </div>
              <div className="flex items-center gap-3">
                <QuantityControl
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.menuItemId, 1)}
                  onDecrease={() => updateQuantity(item.menuItemId, -1)}
                  onRemove={() => removeFromCart(item.menuItemId)}
                  size={isMobile ? "sm" : "md"}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <span className="text-lg font-semibold text-neutral-900 dark:text-white">Total</span>
            <PriceDisplay price={total} size="lg" />
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-gold-500/20 transition-all duration-300 hover:scale-105"
          >
            <CreditCard size={20} />
            Place Order <ArrowRight size={20} />
          </button>
        </div>
      </Modal>
    </ResponsiveContainer>
  );
};

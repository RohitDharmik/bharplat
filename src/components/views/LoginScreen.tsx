import React, { useState } from "react";
import { UserRole } from "../../types";
import {
  ScanLine,
  ChevronRight,
  Play,
  BarChart3,
  ChefHat,
  Users,
  Smartphone,
  ShieldCheck,
  Zap,
  Star,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { Modal, ConfigProvider, theme } from "antd";
import { motion } from "framer-motion";
interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-black">
              <span className="font-bold text-xl">B</span>
            </div>
            <span>
              BHAR<span className="text-gold-500">PLATE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#solutions" className="hover:text-white transition-colors">
              Solutions
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2.5 text-sm font-bold text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              LOG IN
            </button>
            <button className="px-6 py-2.5 text-sm font-bold bg-gold-500 text-black rounded-lg hover:bg-gold-400 transition-colors">
              GET STARTED
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gold-500/20 rounded-full blur-[120px] -z-10 opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              The Future of Dining
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              PRECISION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                MANAGEMENT
              </span>{" "}
              <br />
              FOR DINING
            </h1>
            <p className="text-lg text-neutral-400 max-w-xl leading-relaxed">
              Streamline reservations, KOTs, and table service to elevate your
              customer dining profile, speed, and bottom line. The operating
              system for modern restaurants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                START FREE TRIAL
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10">
                <Play size={20} fill="currentColor" />
                WATCH DEMO
              </button>
            </div>

            <div className="pt-8 flex items-center gap-8 text-neutral-500 text-sm font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center text-xs text-white"
                  >
                    <Users size={14} />
                  </div>
                ))}
              </div>
              <p>Trusted by 500+ venues</p>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full">
            {/* Abstract Dashboard UI Composition */}
            <div className="relative z-10 bg-[#121212] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-gold-500/10 rotate-y-12 transform transition-transform hover:scale-[1.02] duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 to-transparent rounded-2xl pointer-events-none"></div>
              {/* Header Mock */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-6 w-32 bg-white/5 rounded-full"></div>
              </div>
              {/* Body Mock */}
              <div className="p-6 grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="h-32 bg-gold-500/10 rounded-xl border border-gold-500/20 p-4 relative overflow-hidden">
                    <BarChart3
                      className="text-gold-500 absolute bottom-4 right-4"
                      size={48}
                    />
                    <div className="h-4 w-12 bg-gold-500/20 rounded mb-2"></div>
                    <div className="h-8 w-24 bg-gold-500/20 rounded"></div>
                  </div>
                  <div className="h-20 bg-white/5 rounded-xl"></div>
                  <div className="h-20 bg-white/5 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-20 bg-white/5 rounded-xl"></div>
                  <div className="h-48 bg-white/5 rounded-xl p-4">
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-2 w-full bg-white/10 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-10 -left-10 z-20 bg-[#1E1E1E] p-6 rounded-xl border border-white/10 shadow-xl max-w-xs animate-bounce-slow">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-neutral-400 text-xs">System Efficiency</p>
                  <p className="text-2xl font-bold text-white">+42%</p>
                </div>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Efficiency Increase", value: "40%" },
            { label: "Venues Managed", value: "500+" },
            { label: "Uptime Guarantee", value: "99.9%" },
            { label: "Customer Support", value: "24/7" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gold-500 font-bold tracking-wider uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-gold-500 font-bold tracking-widest uppercase text-sm">
            Features Overview
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white">
            ENGINEERED FOR EXCELLENCE
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Table Management",
              desc: "Visualize your floor plan in real-time. Assign seats, track occupancy, and turn tables faster.",
            },
            {
              icon: Smartphone,
              title: "Digital Ordering",
              desc: "QR-based menus allow guests to order instantly. Reduce waiter workload and errors.",
            },
            {
              icon: ChefHat,
              title: "Kitchen Display",
              desc: "Direct-to-kitchen firing with detailed KOTs. Track prep times and eliminate paper tickets.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-neutral-900/50 border border-white/10 p-8 rounded-2xl hover:bg-neutral-800/50 hover:border-gold-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-neutral-800 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                <feature.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Grid */}
      <section className="relative py-24 bg-neutral-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm   p-4 cursor-pointer"
            > */}
              <div className="space-y-8 relative">
                <div className="absolute -top-6 -right-6 w-50 h-50  bg-gold-500 rounded-full opacity-50 blur-xl"></div>

                <h3 className="text-3xl font-bold text-white">
                  Seamless Operations
                  <br />
                  From Front to Back
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      title: "Smart Reservations",
                      desc: "AI-driven booking management that maximizes seating capacity.",
                    },
                    {
                      title: "Financial Analytics",
                      desc: "Real-time revenue tracking, expense reports, and tax automation.",
                    },
                    {
                      title: "Role-Based Access",
                      desc: "Granular permissions for Admins, Managers, Chefs, and Waiters.",
                    },
                    {
                      title: "Multi-Device Sync",
                      desc: "Works flawlessly across Tablets, Mobiles, and Desktop POS.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1">
                        <ShieldCheck className="text-gold-500" size={20} />
                      </div>
                      <div>
                        <h5 className="font-bold text-white">{item.title}</h5>
                        <p className="text-sm text-neutral-400 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 h-64 flex flex-col justify-end">
                  <BarChart3 className="text-purple-500 mb-4" size={32} />
                  <p className="font-bold text-white">Analytics</p>
                  <p className="text-xs text-neutral-500">
                    Data-driven decisions
                  </p>
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 h-64 flex flex-col justify-end mt-12">
                  <Users className="text-blue-500 mb-4" size={32} />
                  <p className="font-bold text-white">Staff Mgmt</p>
                  <p className="text-xs text-neutral-500">Shift & Payroll</p>
                </div>
              </div>
            {/* </motion.div> */}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold text-white mb-16">
          INDUSTRY LEADERS CHOOSE US
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Arjun Mehta",
              role: "Owner, Spice Route",
              quote:
                "Since switching to BharPlate, our table turnover rate improved by 25%. The kitchen display system is a game changer.",
            },
            {
              name: "Sarah Jenkins",
              role: "Manager, The Lofr",
              quote:
                "The financial reporting tools saved us hours of manual work every week. Highly recommended.",
            },
            {
              name: "Vikram Singh",
              role: "Head Chef, Urban Tandoor",
              quote:
                "KOTs are instant and accurate. No more confusion in the kitchen during rush hours.",
            },
          ].map((testi, i) => (
            <div
              key={i}
              className="bg-neutral-900/40 p-8 rounded-2xl border border-white/5"
            >
              <div className="flex gap-1 text-gold-500 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-neutral-300 mb-6 italic">"{testi.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center text-white font-bold">
                  {testi.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{testi.name}</p>
                  <p className="text-xs text-neutral-500">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Footer */}
      <footer className="bg-[#121212] border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gold-500 rounded-3xl p-12 text-center mb-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-black mb-6">
                READY TO ELEVATE?
              </h2>
              <p className="text-black/70 mb-8 max-w-xl mx-auto font-medium">
                Join hundreds of restaurants modernizing their workflow today.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Get Started Now
                </button>
                <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-100 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-12 text-sm text-neutral-400 border-b border-white/10 pb-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="text-2xl font-bold text-white mb-4">
                BHAR<span className="text-gold-500">PLATE</span>
              </div>
              <p>Precision management for the modern dining experience.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Hardware
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gold-500">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold-500">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-xs text-neutral-600">
            © {new Date().getFullYear()} BharPlate. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorBgElevated: "#1E1E1E", borderRadiusLG: 16 },
        }}
      >
        <Modal
          open={isLoginModalOpen}
          onCancel={() => setIsLoginModalOpen(false)}
          footer={null}
          width={500}
          centered
          className="login-modal"
          closeIcon={<X className="text-white" />}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-neutral-400 text-center mb-8 text-sm">
              Select your role to access the dashboard
            </p>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(UserRole)
                .filter((r) => r !== UserRole.GUEST)
                .map((role) => (
                  <button
                    key={role}
                    onClick={() => onLogin(role)}
                    className="px-4 py-4 bg-neutral-800 hover:bg-gold-500 hover:text-black text-neutral-300 rounded-xl text-sm font-bold transition-all border border-white/5 hover:border-gold-500"
                  >
                    {role === UserRole.WAITER ? "Captain" : role}
                  </button>
                ))}
            </div>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1E1E1E] px-2 text-neutral-500">Or</span>
              </div>
            </div>

            <button
              onClick={() => onLogin(UserRole.GUEST)}
              className="w-full px-4 py-4 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <ScanLine size={18} />
              Digital Menu (Guest Mode)
            </button>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

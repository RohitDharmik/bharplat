import React from 'react';
import { SUBSCRIPTION_PLANS } from '../../constants';
import { Check, Zap, CreditCard } from 'lucide-react';
import { Tag } from 'antd';

export const SubscriptionView: React.FC = () => {
  const currentPlanId = 'sp1'; // Mock current plan

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Manage Your Subscription</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Choose the plan that fits your business needs. Upgrade or downgrade at any time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map(plan => {
              const isCurrent = plan.id === currentPlanId;
              return (
                  <div 
                    key={plan.id} 
                    className={`
                        relative bg-white dark:bg-neutral-900/60 rounded-2xl p-6 border transition-all duration-300 flex flex-col
                        ${isCurrent 
                            ? 'border-gold-500 shadow-xl shadow-gold-500/10 scale-105 z-10' 
                            : 'border-neutral-200 dark:border-white/5 hover:border-gold-500/50 hover:shadow-lg'
                        }
                    `}
                  >
                      {isCurrent && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                              Current Plan
                          </div>
                      )}
                      
                      <div className="text-center mb-6">
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center gap-1">
                             <span className="text-3xl font-bold text-gold-600 dark:text-gold-500">₹{plan.price}</span>
                             <span className="text-neutral-500 text-sm">/{plan.validity}</span>
                          </div>
                      </div>

                      <div className="space-y-4 flex-1 mb-8">
                          {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                                  <div className="p-1 bg-green-500/10 rounded-full text-green-500 shrink-0">
                                    <Check size={12} />
                                  </div>
                                  <span>{feature}</span>
                              </div>
                          ))}
                      </div>

                      <button 
                        className={`
                            w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2
                            ${isCurrent 
                                ? 'bg-neutral-100 dark:bg-white/10 text-neutral-500 cursor-default' 
                                : 'bg-gold-500 hover:bg-gold-400 text-black'
                            }
                        `}
                        disabled={isCurrent}
                      >
                          {isCurrent ? 'Active Plan' : (
                              <>
                                <span>Upgrade</span>
                                <Zap size={16} />
                              </>
                          )}
                      </button>
                  </div>
              );
          })}
      </div>

      <div className="bg-neutral-900 text-white rounded-xl p-6 flex justify-between items-center border border-white/10 mt-8">
           <div className="flex items-center gap-4">
               <div className="p-4 bg-white/10 rounded-full">
                   <CreditCard size={24} className="text-gold-500" />
               </div>
               <div>
                   <h4 className="font-bold text-lg">Billing Information</h4>
                   <p className="text-sm text-neutral-400">Next payment of ₹999 due on Aug 1, 2024</p>
               </div>
           </div>
           <button className="text-gold-500 hover:text-white font-medium underline transition-colors">
               Update Payment Method
           </button>
      </div>
    </div>
  );
};
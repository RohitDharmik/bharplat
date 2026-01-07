import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../../constants';
import { useAppStore } from '../../store/useAppStore';
import { usePermissions } from '../../hooks/usePermissions';
import { Check, Zap, CreditCard, Settings, AlertTriangle } from 'lucide-react';
import { Tag, Modal, Button, message } from 'antd';
import { UserRole, FeatureAuthority } from '../../types';
import { PermissionGuard } from '../ui/PermissionGuard';

interface SubscriptionViewProps {
  userRole: UserRole;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ userRole }) => {
  const { outletSubscriptions, createSubscription, updateSubscription, cancelSubscription } = useAppStore();
  const permissions = usePermissions(userRole);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Mock current subscription for the outlet
  const currentSubscription = outletSubscriptions.find(sub => sub.outletId === 'outlet1' && sub.status === 'Active');
  const currentPlanId = currentSubscription?.planId || 'sp1';

  const handleUpgrade = async (planId: string) => {
    if (!permissions.canManageSubscriptions) {
      messageApi.error('You do not have permission to manage subscriptions');
      return;
    }

    try {
      if (currentSubscription) {
        // Update existing subscription
        await updateSubscription(currentSubscription.id, { planId });
      } else {
        // Create new subscription
        await createSubscription({
          outletId: 'outlet1',
          planId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          status: 'Active',
          autoRenew: true,
          paymentMethod: 'Credit Card'
        });
      }
      messageApi.success('Subscription updated successfully');
    } catch (error) {
      messageApi.error('Failed to update subscription');
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    try {
      await cancelSubscription(currentSubscription.id);
      messageApi.success('Subscription cancelled successfully');
      setShowCancelModal(false);
    } catch (error) {
      messageApi.error('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Manage Your Subscription</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Choose the plan that fits your business needs. Upgrade or downgrade at any time.</p>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Subscription Plans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Plan</th>
                <th className="p-3">Price</th>
                <th className="p-3">Features</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {SUBSCRIPTION_PLANS.map(plan => {
                const isCurrent = plan.id === currentPlanId;
                return (
                  <tr key={plan.id} className="border-b border-white/5">
                    <td className="p-3 text-white font-medium">{plan.name}</td>
                    <td className="p-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-gold-500 font-bold">₹{plan.price}</span>
                        <span className="text-neutral-400 text-xs">/{plan.validity}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <Tag key={idx} color="green" className="text-xs">{feature}</Tag>
                        ))}
                        {plan.features.length > 3 && <Tag color="blue" className="text-xs">+{plan.features.length - 3} more</Tag>}
                      </div>
                    </td>
                    <td className="p-3">
                      {isCurrent ? (
                        <Tag color="success">Current Plan</Tag>
                      ) : (
                        <Tag color="default">Available</Tag>
                      )}
                    </td>
                    <td className="p-3">
                      {isCurrent ? (
                        <div className="text-green-400 font-medium">Active</div>
                      ) : (
                        <PermissionGuard
                          userRole={userRole}
                          feature={FeatureAuthority.MANAGE_SUBSCRIPTIONS}
                          fallback={
                            <Button size="small" disabled>No Permission</Button>
                          }
                        >
                          <Button
                            size="small"
                            onClick={() => handleUpgrade(plan.id)}
                            className="bg-gold-500 hover:bg-gold-400 text-black"
                          >
                            Upgrade
                          </Button>
                        </PermissionGuard>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {currentSubscription && (
        <div className="bg-neutral-900 text-white rounded-xl p-6 border border-white/10 mt-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-full">
                <CreditCard size={24} className="text-gold-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Billing Information</h4>
                <p className="text-sm text-neutral-400">
                  Next payment of ₹{SUBSCRIPTION_PLANS.find(p => p.id === currentPlanId)?.price || 0} due on {currentSubscription.endDate.toLocaleDateString()}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Auto-renew: {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'} •
                  Payment Method: {currentSubscription.paymentMethod || 'Not set'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-gold-500 hover:text-white font-medium underline transition-colors">
                Update Payment Method
              </button>
              {permissions.canManageSubscriptions && (
                <Button
                  danger
                  onClick={() => setShowCancelModal(true)}
                  className="ml-2"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      <Modal
        title="Cancel Subscription"
        open={showCancelModal}
        onOk={handleCancelSubscription}
        onCancel={() => setShowCancelModal(false)}
        okText="Cancel Subscription"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to cancel your subscription? This action cannot be undone.</p>
        <p className="text-sm text-neutral-500 mt-2">
          Your subscription will remain active until {currentSubscription?.endDate.toLocaleDateString()}.
        </p>
      </Modal>

      {contextHolder}
    </div>
  );
};
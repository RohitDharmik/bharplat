import React from 'react';
import { MOCK_FEEDBACK } from '../../constants';
import { Star, MessageSquare } from 'lucide-react';

  const FeedbackView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Customer Feedback</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_FEEDBACK.map(item => (
          <div key={item.id} className="bg-neutral-900/60 border border-white/5 rounded-xl p-6 relative">
            <div className="absolute top-6 right-6 text-gold-500 opacity-20">
              <MessageSquare size={40} />
            </div>
            
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < item.rating ? "text-gold-500 fill-gold-500" : "text-neutral-700"} 
                />
              ))}
            </div>
            
            <p className="text-neutral-300 italic mb-6">"{item.comment}"</p>
            
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div>
                <p className="font-bold text-white text-sm">{item.customerName}</p>
                <p className="text-xs text-neutral-500">{item.date.toLocaleDateString()}</p>
              </div>
              {item.tableId && (
                <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-400">
                  Table {item.tableId.replace('t', '')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeedbackView;
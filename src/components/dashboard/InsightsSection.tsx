import React from 'react';
import { Sparkles, Lightbulb, TrendingUp, ChevronRight } from 'lucide-react';
import { CarbonInsight } from '../../types';
import { motion } from 'motion/react';

interface Props {
  insights: CarbonInsight[];
}

const InsightsSection = ({ insights }: Props) => {
  if (insights.length === 0) return null;

  return (
    <section aria-labelledby="insights-title" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 id="insights-title" className="font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Smart Insights
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={insight.id}
            className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              insight.type === 'achievement' ? 'bg-yellow-50 text-yellow-600' :
              insight.type === 'warning' ? 'bg-orange-50 text-orange-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              {insight.type === 'tip' ? <Lightbulb className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {insight.text}
              </p>
              {insight.action && (
                <button className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-0.5 hover:gap-1 transition-all">
                  {insight.action} <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default InsightsSection;

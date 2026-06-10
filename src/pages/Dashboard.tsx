import React, { lazy, Suspense } from "react";
import { useAuth } from "../contexts/AuthContext";
import { TrendingDown, Wind, Trophy, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useDashboard } from "../hooks/useDashboard";
import { CARBON_CATEGORIES } from "../constants";
import CategoryBar from "../components/dashboard/CategoryBar";
import ChallengeCard from "../components/dashboard/ChallengeCard";
import InsightsSection from "../components/dashboard/InsightsSection";
import { formatCarbon } from "../utils/formatters";

const ChartSection = lazy(() => import("../components/ChartSection"));

export default function Dashboard() {
  const { user, ecoPoints, profile } = useAuth();
  const { totalEmissions, categoryImpact, graphData, insights, loading } = useDashboard();

  const monthlyGoal = profile?.monthlyGoal || 500;
  const goalProgress = Math.min((totalEmissions / monthlyGoal) * 100, 100);

  if (loading) {
// ... existing loader ...
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          <div className="h-40 bg-gray-200 rounded-3xl md:col-span-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-3xl" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'Eco-Warrior'}!</h1>
          <p className="text-gray-600 font-medium mt-1">Here's your sustainability overview for today.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-800 font-bold flex items-center gap-2" aria-label={`You have ${ecoPoints} Eco Points`}>
            🌱 <span aria-hidden="true">{ecoPoints}</span> <span className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Eco Points</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section aria-labelledby="total-emissions-title">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="h-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between">
            <div aria-hidden="true" className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>
            <div className="relative z-10 flex items-center gap-3 mb-4">
              <div aria-hidden="true" className="p-3 bg-emerald-100 text-emerald-700 rounded-xl"><Wind className="w-6 h-6" /></div>
              <h3 id="total-emissions-title" className="font-bold text-gray-700">Total Carbon</h3>
            </div>
            <div className="relative z-10 mt-auto">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-gray-900">{formatCarbon(totalEmissions)}</span>
                <span className="text-gray-600 mb-1 font-bold">kg CO₂e</span>
              </div>
              
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500 uppercase tracking-wider">Monthly Goal</span>
                  <span className={goalProgress > 90 ? 'text-red-500' : 'text-emerald-600'}>
                    {Math.round(goalProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden" role="progressbar" aria-valuenow={goalProgress} aria-valuemin={0} aria-valuemax={100}>
                  <div 
                    className={`h-full transition-all duration-1000 ${goalProgress > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic">Target: {monthlyGoal}kg / month</p>
              </div>

              <div className="flex items-center gap-1 mt-4 text-sm text-emerald-700 font-bold">
                <TrendingDown aria-hidden="true" className="w-4 h-4" /> 12% from last month
              </div>
            </div>
          </motion.div>
        </section>

        <section aria-labelledby="trend-title" className="md:col-span-2">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="h-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                  <h3 id="trend-title" className="font-bold text-gray-700">Emissions Trend (7 Days)</h3>
              </div>
              <div className="h-48 w-full" role="img" aria-label="Line chart showing carbon emissions trend over the last 7 days. Emissions have been steadily decreasing.">
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>}>
                  <ChartSection data={graphData} />
                </Suspense>
              </div>
          </motion.div>
        </section>
      </div>

      <InsightsSection insights={insights} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section aria-labelledby="category-title" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 id="category-title" className="font-bold text-gray-700 mb-6 uppercase tracking-wider text-sm">Impact by Category</h3>
            <div className="space-y-6">
              {CARBON_CATEGORIES.map(cat => (
                <CategoryBar 
                  key={cat.id} 
                  icon={cat.icon} 
                  color={cat.color} 
                  name={cat.name} 
                  value={Number((categoryImpact[cat.id as keyof typeof categoryImpact] || 0).toFixed(1))} 
                  target={cat.target} 
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="challenges-title" className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-3 mb-4">
                <div aria-hidden="true" className="p-2 bg-white/20 rounded-xl"><Trophy className="w-6 h-6" /></div>
                <h3 id="challenges-title" className="font-extrabold text-xl tracking-tight">Active Challenges</h3>
            </div>
            <div className="space-y-5 mt-6">
                <ChallengeCard title="Meatless Week" points={50} progress={3} total={7} label="Days Completed" />
                <ChallengeCard title="Public Transit Commuter" points={100} progress={4} total={5} label="Trips Completed" />
            </div>
          </section>
      </div>
    </div>
  );
}

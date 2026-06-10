import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { TrendingDown, Wind, Zap, Car, Utensils, Droplets, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useDashboard } from "../hooks/useDashboard";
import { CARBON_CATEGORIES } from "../constants";

const CategoryBar = React.memo(({ icon: Icon, color, name, value, target }: any) => {
    const isOver = value > target;
    const percentage = Math.min((value/target)*100, 100);
    return (
        <div role="group" aria-labelledby={`cat-label-${name}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div aria-hidden="true" className={`p-1.5 rounded-lg text-white ${color}`}><Icon className="w-4 h-4" /></div>
                    <span id={`cat-label-${name}`} className="text-sm font-bold text-gray-700">{name}</span>
                </div>
                <div className="text-sm font-bold text-gray-900" aria-label={`${value} of ${target} kilograms`}>
                    {value} <span className="text-gray-500 font-medium">/ {target} kg</span>
                </div>
            </div>
            <div 
                className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={target}
                aria-label={`${name} carbon emissions progress`}
            >
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-red-600' : color}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
});

CategoryBar.displayName = 'CategoryBar';

export default function Dashboard() {
  const { user, ecoPoints } = useAuth();
  const { totalEmissions, categoryImpact, graphData } = useDashboard();

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
                <span className="text-4xl font-black text-gray-900">{totalEmissions}</span>
                <span className="text-gray-600 mb-1 font-bold">kg CO₂e</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-emerald-700 font-bold">
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 12, fontWeight: 600}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 12, fontWeight: 600}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 600}} />
                    <Line type="monotone" dataKey="emissions" stroke="#059669" strokeWidth={4} dot={{r: 5, fill: '#059669', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </motion.div>
        </section>
      </div>

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
                <div role="group" aria-label="Meatless Week challenge" className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg">Meatless Week</span>
                        <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">+50 Pts</span>
                    </div>
                    <div 
                      className="w-full bg-black/20 rounded-full h-2.5 mb-2"
                      role="progressbar"
                      aria-valuenow={3}
                      aria-valuemin={0}
                      aria-valuemax={7}
                      aria-label="Meatless Week progress"
                    >
                        <div className="bg-white h-full rounded-full shadow-sm" style={{ width: '40.8%' }}></div>
                    </div>
                    <p className="text-xs font-bold text-emerald-50 text-right">3 / 7 Days Completed</p>
                </div>
                 <div role="group" aria-label="Public Transit Commuter challenge" className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg">Public Transit Commuter</span>
                        <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">+100 Pts</span>
                    </div>
                    <div 
                      className="w-full bg-black/20 rounded-full h-2.5 mb-2"
                      role="progressbar"
                      aria-valuenow={4}
                      aria-valuemin={0}
                      aria-valuemax={5}
                      aria-label="Public Transit Commuter progress"
                    >
                        <div className="bg-white h-full rounded-full shadow-sm" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs font-bold text-emerald-50 text-right">4 / 5 Trips Completed</p>
                </div>
            </div>
          </section>
      </div>
    </div>
  );
}

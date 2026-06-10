import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { TrendingDown, Wind, Zap, Car, Utensils, Droplets, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Dashboard() {
  const { user, ecoPoints } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "logs"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const logsData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => b.date - a.date);
        setLogs(logsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  // Mock data for graphs if no logs
  const emptyGraphData = [
    { name: 'Mon', emissions: 0 },
    { name: 'Tue', emissions: 0 },
    { name: 'Wed', emissions: 0 },
    { name: 'Thu', emissions: 0 },
    { name: 'Fri', emissions: 0 },
    { name: 'Sat', emissions: 0 },
    { name: 'Sun', emissions: 0 },
  ];

  const totalEmissions = logs.reduce((sum, log) => sum + log.carbonEmittedKg, 0).toFixed(1);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.displayName?.split(' ')[0] || 'Eco-Warrior'}!</h1>
          <p className="text-gray-500 mt-1">Here's your sustainability overview for today.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 font-bold flex items-center gap-2">
            🌱 {ecoPoints} <span className="text-sm font-medium text-emerald-700">Eco Points</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Wind className="w-6 h-6" /></div>
            <h3 className="font-semibold text-gray-700">Total Carbon</h3>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-gray-900">{totalEmissions}</span>
              <span className="text-gray-500 mb-1 font-medium">kg CO₂e</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-emerald-600 font-medium">
              <TrendingDown className="w-4 h-4" /> 12% from last month
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between md:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-700">Emissions Trend (7 Days)</h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emptyGraphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="emissions" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-6">Impact by Category</h3>
            <div className="space-y-4">
               <CategoryBar icon={Car} color="bg-blue-500" name="Transport" value={45} target={50} />
               <CategoryBar icon={Zap} color="bg-yellow-500" name="Energy" value={80} target={60} />
               <CategoryBar icon={Utensils} color="bg-orange-500" name="Food" value={30} target={40} />
               <CategoryBar icon={Droplets} color="bg-cyan-500" name="Water" value={15} target={20} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl"><Trophy className="w-6 h-6" /></div>
                <h3 className="font-bold text-lg">Active Challenges</h3>
            </div>
            <div className="space-y-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Meatless Week</span>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded text-green-50">+50 Pts</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2 mb-1">
                        <div className="bg-white h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="text-xs text-green-100 text-right">3/7 Days</p>
                </div>
                 <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Public Transit Commuter</span>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded text-green-50">+100 Pts</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2 mb-1">
                        <div className="bg-white h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-green-100 text-right">4/5 Trips</p>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}

function CategoryBar({ icon: Icon, color, name, value, target }: any) {
    const isOver = value > target;
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg text-white ${color}`}><Icon className="w-4 h-4" /></div>
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">{value} <span className="text-gray-400 font-normal">/ {target} kg</span></div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className={`h-2.5 rounded-full ${isOver ? 'bg-red-500' : color}`} style={{ width: `${Math.min((value/target)*100, 100)}%` }}></div>
            </div>
        </div>
    )
}

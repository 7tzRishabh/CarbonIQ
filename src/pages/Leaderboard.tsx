import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trophy, Medal, Loader2, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(
          collection(db, "users"),
          orderBy("ecoPoints", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        setLeaders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-3">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Leaderboard</h1>
          <p className="text-gray-500 mt-1">Top 10 sustainability champions this month.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {leaders.map((leader, index) => (
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={leader.id} 
                className={`flex items-center gap-4 p-4 md:p-6 transition-colors hover:bg-gray-50 ${user?.uid === leader.id ? 'bg-emerald-50/50' : ''}`}
              >
                <div className="flex-shrink-0 w-8 font-bold text-gray-400 text-center">
                  {index === 0 ? <Medal className="w-6 h-6 mx-auto text-yellow-500" /> : 
                   index === 1 ? <Medal className="w-6 h-6 mx-auto text-gray-400" /> : 
                   index === 2 ? <Medal className="w-6 h-6 mx-auto text-amber-700" /> : 
                   `#${index + 1}`}
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {leader.photoURL ? (
                    <img src={leader.photoURL} alt={leader.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {leader.displayName || 'Eco Warrior'} {user?.uid === leader.id && <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-xs text-gray-500 truncate">Joined {new Date(leader.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600 truncate">{leader.ecoPoints || 0}</p>
                  <p className="text-xs text-gray-500 font-medium">pts</p>
                </div>
              </motion.li>
            ))}
            {leaders.length === 0 && (
              <li className="p-12 text-center text-gray-500">No leaders found yet. Be the first!</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

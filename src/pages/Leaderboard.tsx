import React from "react";
import { Trophy, Medal, Loader2, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useLeaderboard } from "../hooks/useLeaderboard";

export default function Leaderboard() {
  const { leaders, loading } = useLeaderboard();
  const { user } = useAuth();

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

      <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100" aria-labelledby="leaderboard-title">
        <h2 id="leaderboard-title" className="sr-only">Top 10 Leaders</h2>
        {loading ? (
          <div className="flex justify-center p-12" role="status">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="sr-only">Loading leaderboard data...</span>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {leaders.map((leader, index) => (
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={leader.uid} 
                className={`flex items-center gap-4 p-4 md:p-6 transition-colors hover:bg-gray-50 ${user?.uid === leader.uid ? 'bg-emerald-50/50' : ''}`}
              >
                <div className="flex-shrink-0 w-10 font-bold text-gray-500 text-center">
                  {index === 0 ? <Medal aria-label="First Place Gold Medal" className="w-7 h-7 mx-auto text-yellow-600" /> : 
                   index === 1 ? <Medal aria-label="Second Place Silver Medal" className="w-7 h-7 mx-auto text-gray-500" /> : 
                   index === 2 ? <Medal aria-label="Third Place Bronze Medal" className="w-7 h-7 mx-auto text-amber-800" /> : 
                   <span aria-label={`Rank ${index + 1}`}>#{index + 1}</span>}
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm" aria-hidden="true">
                  {leader.photoURL ? (
                    <img src={leader.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {leader.displayName || 'Eco Warrior'} {user?.uid === leader.uid && <span className="ml-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-xs text-gray-700 font-medium truncate">Joined {new Date(leader.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-emerald-700 truncate" aria-label={`${leader.ecoPoints || 0} Eco Points`}>
                    {leader.ecoPoints || 0}
                  </p>
                  <p className="text-xs text-emerald-900 font-bold uppercase tracking-wider" aria-hidden="true">pts</p>
                </div>
              </motion.li>
            ))}
            {leaders.length === 0 && (
              <li className="p-12 text-center text-gray-700 font-medium italic">No leaders found yet. Be the first!</li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

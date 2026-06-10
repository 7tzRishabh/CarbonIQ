import React from 'react';
import { motion } from 'motion/react';
import { Medal, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../../types';

interface LeaderRowProps {
  leader: UserProfile;
  index: number;
  isCurrentUser: boolean;
}

const LeaderRow = React.memo(({ leader, index, isCurrentUser }: LeaderRowProps) => (
  <motion.li 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center gap-4 p-4 md:p-6 transition-colors hover:bg-gray-50 ${isCurrentUser ? 'bg-emerald-50/50' : ''}`}
  >
    <div className="flex-shrink-0 w-10 font-bold text-gray-500 text-center">
      {index === 0 ? <Medal aria-label="First Place Gold Medal" className="w-7 h-7 mx-auto text-yellow-600" /> : 
       index === 1 ? <Medal aria-label="Second Place Silver Medal" className="w-7 h-7 mx-auto text-gray-500" /> : 
       index === 2 ? <Medal aria-label="Third Place Bronze Medal" className="w-7 h-7 mx-auto text-amber-800" /> : 
       <span aria-label={`Rank ${index + 1}`}>#{index + 1}</span>}
    </div>
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm" aria-hidden="true">
      {leader.photoURL ? (
        <img src={leader.photoURL} alt="" loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <UserIcon className="w-6 h-6 text-gray-400" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-gray-900 truncate">
        {leader.displayName || 'Eco Warrior'} {isCurrentUser && <span className="ml-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">You</span>}
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
));

LeaderRow.displayName = 'LeaderRow';

export default LeaderRow;

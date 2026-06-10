import React from 'react';
import { Challenge } from '../../types';

const ChallengeCard = React.memo(({ title, points, progress, total, label }: Challenge) => (
  <div role="group" aria-label={`${title} challenge`} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
      <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-lg">{title}</span>
          <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">+{points} Pts</span>
      </div>
      <div 
        className="w-full bg-black/20 rounded-full h-2.5 mb-2"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${title} progress`}
      >
          <div className="bg-white h-full rounded-full shadow-sm transition-all duration-700" style={{ width: `${(progress/total)*100}%` }}></div>
      </div>
      <p className="text-xs font-bold text-emerald-50 text-right">{progress} / {total} {label}</p>
  </div>
));

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;

import React from "react";
import { Trophy, Loader2 } from "lucide-react";
import * as ReactWindow from "react-window";
import { useAuth } from "../contexts/AuthContext";
import { useLeaderboard } from "../hooks/useLeaderboard";
import LeaderRow from "../components/leaderboard/LeaderRow";

const List = (ReactWindow as any).FixedSizeList;

export default function Leaderboard() {
  const { leaders, loading } = useLeaderboard();
  const { user } = useAuth();

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const leader = leaders[index];
    return (
      <div style={style}>
        <LeaderRow 
          leader={leader}
          index={index}
          isCurrentUser={user?.uid === leader.uid}
        />
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-3">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
          <Trophy aria-hidden="true" className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Leaderboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Top sustainability champions this month.</p>
        </div>
      </header>

      <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[600px] flex flex-col" aria-labelledby="leaderboard-title">
        <h2 id="leaderboard-title" className="sr-only">Top Leaders</h2>
        {loading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl w-full" />
            ))}
          </div>
        ) : (
          <div className="flex-1">
            {leaders.length > 0 ? (
              <List
                height={600}
                itemCount={leaders.length}
                itemSize={90}
                width="100%"
              >
                {Row}
              </List>
            ) : (
              <div className="p-12 text-center text-gray-700 font-medium italic">No leaders found yet. Be the first!</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

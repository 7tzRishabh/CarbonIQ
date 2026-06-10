import { useState, useEffect } from "react";
import { carbonService } from "../services/carbonService";
import { UserProfile } from "../types";

export function useLeaderboard() {
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await carbonService.getLeaderboard();
        setLeaders(data);
      } catch (e) {
        console.error("Leaderboard fetch failed:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return { leaders, loading };
}

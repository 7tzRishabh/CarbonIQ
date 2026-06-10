import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { carbonService } from "../services/carbonService";
import { CarbonLog, CarbonInsight } from "../types";

export function useDashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CarbonLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return;
      try {
        const logsData = await carbonService.getUserLogs(user.uid, 30);
        setLogs(logsData);
      } catch (e) {
        console.error("Dashboard fetch logs failed:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [user]);

  const totalEmissions = useMemo(() => {
    return logs.reduce((sum, log) => sum + log.carbonEmittedKg, 0);
  }, [logs]);

  const insights = useMemo<CarbonInsight[]>(() => {
    if (logs.length === 0) return [];
    
    const results: CarbonInsight[] = [];
    
    // Check for high transport emissions
    const transport = logs.filter(l => l.category === 'transportation').reduce((s, l) => s + l.carbonEmittedKg, 0);
    if (transport > 50) {
      results.push({
        id: 'transport_high',
        type: 'warning',
        text: 'Your transport emissions are 20% higher than average this week.',
        action: 'Try carpooling'
      });
    }

    // Achievement: Consistently low food emissions
    const food = logs.filter(l => l.category === 'food').reduce((s, l) => s + l.carbonEmittedKg, 0);
    if (food < 10 && logs.length > 5) {
      results.push({
        id: 'food_win',
        type: 'achievement',
        text: 'Eco-chef! Your food choice emissions have stayed minimal all week.',
      });
    }

    results.push({
      id: 'general_tip',
      type: 'tip',
      text: 'Switching to LED bulbs can save up to 75kg of CO2 per year.',
    });

    return results;
  }, [logs]);

  const categoryImpact = useMemo(() => {
    const categories = {
      transportation: 0,
      electricity: 0,
      food: 0,
      other: 0
    };
    logs.forEach(log => {
      const cat = (log.category || 'other').toLowerCase();
      if (categories.hasOwnProperty(cat)) {
        categories[cat as keyof typeof categories] += log.carbonEmittedKg;
      } else {
        categories.other += log.carbonEmittedKg;
      }
    });
    return categories;
  }, [logs]);

  const graphData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const dailyEmissions: Record<string, number> = {};
    last7Days.forEach(day => dailyEmissions[day] = 0);

    logs.forEach(log => {
      const day = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (dailyEmissions[day] !== undefined) {
        dailyEmissions[day] += log.carbonEmittedKg;
      }
    });

    return last7Days.map(name => ({
      name,
      emissions: Number(dailyEmissions[name].toFixed(1))
    }));
  }, [logs]);

  return {
    logs,
    loading,
    totalEmissions,
    categoryImpact,
    graphData,
    insights
  };
}

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { carbonService } from "../services/carbonService";
import { CarbonLog } from "../types";

export function useDashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CarbonLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return;
      try {
        const logsData = await carbonService.getUserLogs(user.uid);
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
    return logs.reduce((sum, log) => sum + log.carbonEmittedKg, 0).toFixed(1);
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
    graphData
  };
}

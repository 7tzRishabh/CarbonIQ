import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { carbonService } from "../services/carbonService";
import { CarbonLog } from "../types";

export function useReports() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CarbonLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return;
      try {
        const data = await carbonService.getUserLogs(user.uid);
        setLogs(data);
      } catch (e) {
        console.error("Reports fetch logs failed:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [user]);

  const exportToCSV = useCallback(() => {
    if (logs.length === 0) return;

    const headers = ["Date", "Category", "Amount", "Carbon Emitted (kg)", "Notes"];
    const csvRows = [
      headers.join(","),
      ...logs.map(log => [
        new Date(log.date).toLocaleDateString(),
        log.category,
        log.value,
        log.carbonEmittedKg.toFixed(2),
        `"${log.notes || ''}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `carbon_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [logs]);

  return { logs, loading, exportToCSV };
}

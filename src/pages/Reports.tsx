import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FileDown, FileText, Loader2, BarChart2 } from "lucide-react";
import { motion } from "motion/react";

export default function Reports() {
  const { user } = useAuth();
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

  const downloadCSV = () => {
    if (logs.length === 0) return;
    
    const headers = ["Date", "Category", "Activity Amount", "Carbon Emitted (kg)", "Notes"];
    const csvContent = [
      headers.join(","),
      ...logs.map(log => {
        const d = new Date(log.date).toLocaleDateString();
        const cat = log.category;
        const val = log.value;
        const carbon = log.carbonEmittedKg.toFixed(2);
        const notes = `"${(log.notes || "").replace(/"/g, '""')}"`;
        return `${d},${cat},${val},${carbon},${notes}`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `carboniq_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalEmissions = logs.reduce((sum, log) => sum + log.carbonEmittedKg, 0);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Impact Reports</h1>
          <p className="text-gray-500 mt-1">Review your sustainability journey and export data.</p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={loading || logs.length === 0}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <FileDown className="w-5 h-5" /> Export Data (CSV)
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-gray-600 mb-2">
                <BarChart2 className="w-5 h-5 text-emerald-500" /> Total Logs Recorded
              </div>
              <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-gray-600 mb-2">
                <FileText className="w-5 h-5 text-emerald-500" /> Total Carbon Tracked
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalEmissions.toFixed(1)} <span className="text-sm font-medium text-gray-500">kg CO₂e</span></p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">Detailed Logging History</h2>
          {logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold rounded-t-xl">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 whitespace-nowrap">Impact</th>
                    <th className="px-4 py-3 rounded-tr-xl">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <motion.tr initial={{opacity:0}} animate={{opacity:1}} key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4 capitalize font-medium text-gray-900">{log.category}</td>
                      <td className="px-4 py-4 text-gray-600">{log.value}</td>
                      <td className="px-4 py-4 font-semibold text-emerald-600">{log.carbonEmittedKg.toFixed(2)} kg</td>
                      <td className="px-4 py-4 text-gray-500 max-w-xs truncate">{log.notes || "-"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-500">
              No logs available yet. Start tracking to see your history!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

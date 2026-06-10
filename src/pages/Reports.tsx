import React from "react";
import { FileDown, FileText, Loader2, BarChart2 } from "lucide-react";
import { motion } from "motion/react";
import { useReports } from "../hooks/useReports";

export default function Reports() {
  const { logs, loading, exportToCSV } = useReports();

  const totalEmissions = logs.reduce((sum, log) => sum + log.carbonEmittedKg, 0);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Impact Reports</h1>
          <p className="text-gray-500 mt-1">Review your sustainability journey and export data.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={loading || logs.length === 0}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <FileDown className="w-5 h-5" /> Export Data (CSV)
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-12" role="status">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="sr-only">Loading reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <section aria-labelledby="summary-title" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <h2 id="summary-title" className="sr-only">Impact Summary</h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 text-gray-700 font-bold mb-2">
                <BarChart2 aria-hidden="true" className="w-5 h-5 text-emerald-600" /> Total Logs Recorded
              </div>
              <p className="text-3xl font-black text-gray-900">{logs.length}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 text-gray-700 font-bold mb-2">
                <FileText aria-hidden="true" className="w-5 h-5 text-emerald-600" /> Total Carbon Tracked
              </div>
              <p className="text-3xl font-black text-gray-900">{totalEmissions.toFixed(1)} <span className="text-sm font-bold text-gray-600">kg CO₂e</span></p>
            </div>
          </section>

          <h2 id="history-title" className="text-lg font-bold text-gray-900 mb-4">Detailed Logging History</h2>
          {logs.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table aria-labelledby="history-title" className="w-full text-sm text-left border-collapse">
                <caption className="sr-only">List of your tracked sustainability activities including date, category, amount, carbon impact, and notes.</caption>
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-4 whitespace-nowrap">Date</th>
                    <th scope="col" className="px-4 py-4 whitespace-nowrap">Category</th>
                    <th scope="col" className="px-4 py-4 whitespace-nowrap">Amount</th>
                    <th scope="col" className="px-4 py-4 whitespace-nowrap">Impact</th>
                    <th scope="col" className="px-4 py-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <motion.tr initial={{opacity:0}} animate={{opacity:1}} key={log.id} className="hover:bg-gray-50 transition-colors focus-within:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4 capitalize font-bold text-gray-900">{log.category}</td>
                      <td className="px-4 py-4 text-gray-700 font-medium">{log.value}</td>
                      <td className="px-4 py-4 font-black text-emerald-700">{log.carbonEmittedKg.toFixed(2)} kg</td>
                      <td className="px-4 py-4 text-gray-600 max-w-xs">{log.notes || "-"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12 text-gray-700 font-medium italic border-2 border-dashed border-gray-100 rounded-2xl">
              No logs available yet. Start tracking to see your history!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

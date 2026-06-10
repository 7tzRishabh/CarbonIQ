import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Car, Zap, Utensils, Briefcase, Plus, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function Calculator() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    category: "transportation",
    value: "",
    notes: ""
  });

  const categories = [
    { id: "transportation", name: "Transport", icon: Car, unit: "km driven", multiplier: 0.192 },
    { id: "electricity", name: "Electricity", icon: Zap, unit: "kWh", multiplier: 0.85 },
    { id: "food", name: "Food", icon: Utensils, unit: "kg of meat", multiplier: 15.0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.value) return;

    setLoading(true);
    setSuccess(false);

    const categoryObj = categories.find(c => c.id === formData.category);
    const carbonEmittedKg = parseFloat(formData.value) * (categoryObj?.multiplier || 1);

    try {
      await addDoc(collection(db, "logs"), {
        userId: user.uid,
        category: formData.category,
        value: parseFloat(formData.value),
        carbonEmittedKg,
        date: Date.now(),
        notes: formData.notes
      });

      await updateDoc(doc(db, "users", user.uid), {
        carbonScore: increment(carbonEmittedKg),
        ecoPoints: increment(10),
        updatedAt: Date.now()
      });

      setSuccess(true);
      setFormData({ ...formData, value: "", notes: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to log activity:", err);
      if (err.message && err.message.includes("permission")) {
          alert("Database rules need to be deployed exactly as generated.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Carbon Calculator</h1>
        <p className="text-gray-500 mt-1">Log your daily activities to track your footprint.</p>
      </header>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Select Activity Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {categories.map(c => {
                const isSelected = formData.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Select ${c.name} category`}
                    onClick={() => setFormData({ ...formData, category: c.id })}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <c.icon className={`w-8 h-8 ${isSelected ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span className="font-medium">{c.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2">
                Amount ({categories.find(c => c.id === formData.category)?.unit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="value"
                  required
                  min="0.1"
                  step="0.1"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  placeholder="e.g. 15.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <input
                type="text"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="What did you do?"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white rounded-xl py-4 font-bold tracking-wide hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Log Activity</>}
            </button>
            {success && (
                <motion.p aria-live="polite" initial={{opacity:0}} animate={{opacity:1}} className="text-emerald-600 text-center font-medium mt-4">
                    Activity logged successfully! You earned 10 Eco Points.
                </motion.p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

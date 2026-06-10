import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCalculator } from "../hooks/useCalculator";

export default function Calculator() {
  const { 
    formData, 
    loading, 
    success, 
    selectedCategory, 
    categories, 
    handleSubmit, 
    selectCategory, 
    updateValue, 
    updateNotes 
  } = useCalculator();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Carbon Calculator</h1>
        <p className="text-gray-500 mt-1">Log your daily activities to track your footprint.</p>
      </header>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} aria-labelledby="calculator-title" className="space-y-8">
          
          <fieldset>
            <legend id="category-legend" className="block text-sm font-bold text-gray-700 mb-4">Select Activity Category</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-labelledby="category-legend">
              {categories.map(c => {
                const isSelected = formData.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${c.name} activity`}
                    onClick={() => selectCategory(c.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                      isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <c.icon aria-hidden="true" className={`w-8 h-8 ${isSelected ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span className="font-bold">{c.name}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="space-y-6">
            <div>
              <label htmlFor="value" className="block text-sm font-bold text-gray-700 mb-2">
                Amount ({selectedCategory?.unit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="value"
                  required
                  min="0.1"
                  step="any"
                  value={formData.value}
                  onChange={(e) => updateValue(e.target.value)}
                  className="w-full rounded-xl border-gray-300 bg-gray-50 p-4 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-500 font-medium"
                  placeholder="e.g. 15.5"
                  aria-required="true"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
              <input
                type="text"
                id="notes"
                value={formData.notes}
                onChange={(e) => updateNotes(e.target.value)}
                className="w-full rounded-xl border-gray-300 bg-gray-50 p-4 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-500 font-medium"
                placeholder="What did you do?"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white rounded-xl py-4 font-bold tracking-wide hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/40 transition-all flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-emerald-200"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-label="Logging activity..." /> : <><Plus aria-hidden="true" className="w-5 h-5" /> Log Activity</>}
            </button>
            {success && (
                <motion.div role="status" aria-live="polite" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 p-4 rounded-xl mt-6 border border-emerald-100 font-bold">
                    <span className="text-xl">✅</span> Activity logged successfully! You earned 10 Eco Points.
                </motion.div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

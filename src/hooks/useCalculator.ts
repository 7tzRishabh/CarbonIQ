import { useState, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { carbonService } from "../services/carbonService";
import { CARBON_CATEGORIES } from "../constants";

export function useCalculator() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: "transportation",
    value: "",
    notes: ""
  });

  const selectedCategory = useMemo(() => 
    CARBON_CATEGORIES.find(c => c.id === formData.category),
    [formData.category]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.value || !selectedCategory) return;

    setLoading(true);
    setSuccess(false);

    const carbonEmittedKg = parseFloat(formData.value) * selectedCategory.multiplier;

    try {
      await carbonService.logActivity(user.uid, {
        category: formData.category,
        value: parseFloat(formData.value),
        carbonEmittedKg,
        notes: formData.notes
      });

      setSuccess(true);
      showToast("Activity logged! +10 Eco Points", "success");
      setFormData(prev => ({ ...prev, value: "", notes: "" }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Calculator submission failed:", err);
      showToast("Failed to log activity. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [user, formData, selectedCategory]);

  const selectCategory = useCallback((id: string) => {
    setFormData(prev => ({ ...prev, category: id }));
  }, []);

  const updateValue = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, value }));
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setFormData(prev => ({ ...prev, notes }));
  }, []);

  return {
    formData,
    loading,
    success,
    selectedCategory,
    categories: CARBON_CATEGORIES,
    handleSubmit,
    selectCategory,
    updateValue,
    updateNotes
  };
}

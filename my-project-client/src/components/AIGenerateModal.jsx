import { useState } from "react";
import { X, Sparkles, Loader2, ChefHat } from "lucide-react";

const CUISINES = ["Indian", "Chinese", "Italian", "Mexican", "American", "Other"];

export default function AIGenerateModal({ isOpen, onClose, onGenerate, isLoading }) {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    // Parse ingredients (comma or newline separated)
    const ingredientList = ingredients
      .split(/[,\n]/)
      .map((i) => i.trim())
      .filter(Boolean);

    if (ingredientList.length === 0) {
      setError("Please enter at least one valid ingredient");
      return;
    }

    if (ingredientList.length > 20) {
      setError("Please enter no more than 20 ingredients");
      return;
    }

    setError("");
    
    try {
      await onGenerate(ingredientList, cuisine || undefined);
      // Reset form on success
      setIngredients("");
      setCuisine("");
      onClose();
    } catch (error) {
      // Error is handled in parent
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Recipe Generator
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-purple-100 text-sm mt-1">
            Tell me what ingredients you have, and I'll create a delicious recipe!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Ingredients */}
          <div>
            <label
              htmlFor="ai-ingredients"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              What's in your pantry? *
            </label>
            <textarea
              id="ai-ingredients"
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter ingredients (comma or newline separated)&#10;e.g., chicken, rice, garlic, onion, tomatoes"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isLoading}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          {/* Cuisine Preference */}
          <div>
            <label
              htmlFor="ai-cuisine"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Preferred Cuisine <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              id="ai-cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              disabled={isLoading}
            >
              <option value="">Chef's choice</option>
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* AI Info */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-700 dark:text-purple-300">
              <p className="font-medium">How it works:</p>
              <p className="text-purple-600 dark:text-purple-400 mt-1">
                Our AI chef will analyze your ingredients and create a complete recipe with instructions, cooking time, and more!
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Recipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

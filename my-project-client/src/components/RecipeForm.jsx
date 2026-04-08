import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

const CUISINES = ["Indian", "Chinese", "Italian", "Mexican", "American", "Other"];

export default function RecipeForm({ isOpen, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    cuisine: "Indian",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Recipe name is required";
    } else if (formData.name.length > 150) {
      newErrors.name = "Recipe name must be 150 characters or less";
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    if (!formData.steps.trim()) {
      newErrors.steps = "At least one step is required";
    }

    if (!formData.cookingTime) {
      newErrors.cookingTime = "Cooking time is required";
    } else if (formData.cookingTime < 1 || formData.cookingTime > 1440) {
      newErrors.cookingTime = "Cooking time must be between 1 and 1440 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        cookingTime: parseInt(formData.cookingTime, 10),
      });
      // Reset form on success
      setFormData({
        name: "",
        ingredients: "",
        steps: "",
        cookingTime: "",
        cuisine: "Indian",
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" />
            Add New Recipe
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recipe Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Recipe Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Butter Chicken"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Ingredients * <span className="text-gray-400 font-normal">(one per line)</span>
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="500g chicken breast&#10;2 tbsp butter&#10;1 cup tomato puree&#10;..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.ingredients
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isLoading}
            />
            {errors.ingredients && (
              <p className="mt-1 text-sm text-red-500">{errors.ingredients}</p>
            )}
          </div>

          {/* Steps */}
          <div>
            <label
              htmlFor="steps"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Cooking Steps * <span className="text-gray-400 font-normal">(one per line)</span>
            </label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="Marinate the chicken for 30 minutes&#10;Heat butter in a pan&#10;Cook until golden brown&#10;..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.steps
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isLoading}
            />
            {errors.steps && (
              <p className="mt-1 text-sm text-red-500">{errors.steps}</p>
            )}
          </div>

          {/* Cooking Time & Cuisine */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cookingTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cooking Time (minutes) *
              </label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="30"
                min="1"
                max="1440"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.cookingTime
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                disabled={isLoading}
              />
              {errors.cookingTime && (
                <p className="mt-1 text-sm text-red-500">{errors.cookingTime}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="cuisine"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cuisine
              </label>
              <select
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                disabled={isLoading}
              >
                {CUISINES.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
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
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Recipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

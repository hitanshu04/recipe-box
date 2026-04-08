import { useState } from "react";
import { Heart, Clock, Trash2, Sparkles, ChevronDown, ChevronUp, ImageOff } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

// Default placeholder image for recipes without images
const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop";

const cuisineColors = {
  Indian: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  Chinese: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  Italian: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  Mexican: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  American: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Other: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
};

export default function RecipeCard({ recipe, onToggleFavorite, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [optimisticFavorite, setOptimisticFavorite] = useState(recipe.isFavorite);
  const [imageError, setImageError] = useState(false);

  // Parse ingredients and steps from newline-separated strings
  const ingredients = recipe.ingredients?.split("\n").filter(Boolean) || [];
  const steps = recipe.steps?.split("\n").filter(Boolean) || [];

  const handleFavoriteClick = async () => {
    // Optimistic update
    setOptimisticFavorite(!optimisticFavorite);
    
    try {
      await onToggleFavorite(recipe.id);
    } catch (error) {
      // Rollback on error
      setOptimisticFavorite(optimisticFavorite);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(recipe.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${isDeleting ? "opacity-50 scale-95" : ""}`}>
        {/* Recipe Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {!imageError && (recipe.imageUrl || DEFAULT_FOOD_IMAGE) ? (
            <img
              src={recipe.imageUrl || DEFAULT_FOOD_IMAGE}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <ImageOff className="w-12 h-12" />
            </div>
          )}
          {/* AI Badge on Image */}
          {recipe.isAiGenerated && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-lg">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
          {/* Favorite Button on Image */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 shadow-lg ${
              optimisticFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800"
            }`}
            aria-label={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 transition-all ${optimisticFavorite ? "fill-current scale-110" : ""}`}
            />
          </button>
        </div>

        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                {recipe.name}
              </h3>
              <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${cuisineColors[recipe.cuisine] || cuisineColors.Other}`}>
                {recipe.cuisine}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Cooking Time */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{recipe.cookingTime} minutes</span>
          </div>

          {/* Ingredients Preview */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ingredients
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {ingredients.slice(0, 3).join(", ")}
              {ingredients.length > 3 && ` +${ingredients.length - 3} more`}
            </p>
          </div>

          {/* Expandable Section */}
          {isExpanded && (
            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              {/* Full Ingredients */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  All Ingredients
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Steps
                </h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{step.replace(/^\d+[\.\)]\s*/, "")}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  More
                </>
              )}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(recipe.createdAt)}
          </span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Keep"
        variant="danger"
      />
    </>
  );
}

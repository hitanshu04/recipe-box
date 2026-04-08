import { SearchX, ChefHat } from "lucide-react";

export default function EmptyState({ type = "no-results", searchTerm = "" }) {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
          <SearchX className="w-12 h-12 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No recipes found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {searchTerm
            ? `We couldn't find any recipes matching "${searchTerm}". Try adjusting your search or filters.`
            : "No recipes match your current filters. Try changing the cuisine or clearing your search."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full flex items-center justify-center mb-6 relative">
          <ChefHat className="w-16 h-16 text-orange-500" />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
            <span className="text-2xl">+</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Your Recipe Box is Empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          Start building your collection! Add your favorite recipes manually or let our AI chef create something delicious for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-600 dark:text-orange-400 font-medium text-xs">
              1
            </span>
            Click "Add Recipe" to create manually
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-600 dark:text-orange-400 font-medium text-xs">
              2
            </span>
            Or use "AI Chef" to generate
          </div>
        </div>
      </div>
    );
  }

  return null;
}

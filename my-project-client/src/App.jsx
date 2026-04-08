import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Sparkles, ChefHat, RefreshCw } from "lucide-react";

import { ThemeProvider } from "./context/ThemeContext";
import { useDebounce, useRecipes } from "./hooks/useDebounce";
import { recipeService } from "./services/api";

import DarkModeToggle from "./components/DarkModeToggle";
import SearchBar from "./components/SearchBar";
import CuisineFilter from "./components/CuisineFilter";
import RecipeCard from "./components/RecipeCard";
import RecipeForm from "./components/RecipeForm";
import AIGenerateModal from "./components/AIGenerateModal";
import EmptyState from "./components/EmptyState";
import { RecipeGridSkeleton } from "./components/RecipeCardSkeleton";

function AppContent() {
  // State management
  const {
    recipes,
    setRecipes,
    loading,
    setLoading,
    error,
    setError,
    updateRecipe,
    addRecipe,
    removeRecipe,
  } = useRecipes();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Debounce search term (300ms as per PRD)
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch recipes
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await recipeService.getAll({
        search: debouncedSearch,
        cuisine: selectedCuisine,
      });
      setRecipes(response.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.response?.data?.message || "Failed to fetch recipes");
      toast.error("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCuisine, setRecipes, setLoading, setError]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Handle create recipe
  const handleCreateRecipe = async (recipeData) => {
    setIsCreating(true);
    try {
      const response = await recipeService.create(recipeData);
      addRecipe(response.data);
      toast.success("Recipe created successfully!");
      setShowRecipeForm(false);
    } catch (err) {
      console.error("Error creating recipe:", err);
      toast.error(err.response?.data?.message || "Failed to create recipe");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  // Handle AI generation
  const handleGenerateRecipe = async (ingredients, cuisine) => {
    setIsGenerating(true);
    
    // Show loading toast
    const loadingToast = toast.loading("AI is cooking up something delicious...");
    
    try {
      const response = await recipeService.generate(ingredients, cuisine);
      addRecipe(response.data);
      toast.dismiss(loadingToast);
      toast.success("AI recipe generated successfully!", {
        icon: "✨",
        duration: 4000,
      });
      setShowAIModal(false);
    } catch (err) {
      console.error("Error generating recipe:", err);
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Failed to generate recipe");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle toggle favorite (with optimistic UI)
  const handleToggleFavorite = async (id) => {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;

    // Optimistic update is handled in RecipeCard
    try {
      const response = await recipeService.toggleFavorite(id);
      updateRecipe(id, { isFavorite: response.data.isFavorite });
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Failed to update favorite status");
      throw err; // Re-throw for optimistic rollback
    }
  };

  // Handle delete recipe
  const handleDeleteRecipe = async (id) => {
    try {
      await recipeService.delete(id);
      removeRecipe(id);
      toast.success("Recipe deleted successfully");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      toast.error(err.response?.data?.message || "Failed to delete recipe");
      throw err;
    }
  };

  // Determine empty state type
  const hasFilters = debouncedSearch || selectedCuisine !== "All";
  const isEmpty = !loading && recipes.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  RecipeBox
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI Kitchen Assistant
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAIModal(true)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg pulse-animation"
              >
                <Sparkles className="w-4 h-4" />
                AI Chef
              </button>
              <button
                onClick={() => setShowRecipeForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Recipe</span>
              </button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name or ingredient..."
              />
            </div>
            <button
              onClick={fetchRecipes}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          
          <CuisineFilter
            selected={selectedCuisine}
            onChange={setSelectedCuisine}
          />

          {/* Mobile AI Button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg"
          >
            <Sparkles className="w-5 h-5" />
            Generate Recipe with AI
          </button>
        </div>

        {/* Results Count */}
        {!loading && !isEmpty && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
            {hasFilters && " (filtered)"}
          </p>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={fetchRecipes}
              className="mt-2 text-sm text-red-600 dark:text-red-300 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <RecipeGridSkeleton count={6} />}

        {/* Empty State */}
        {isEmpty && (
          <EmptyState
            type={hasFilters ? "no-results" : "empty"}
            searchTerm={debouncedSearch}
          />
        )}

        {/* Recipe Grid */}
        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built with React, Express, Prisma & AI
          </p>
        </div>
      </footer>

      {/* Modals */}
      <RecipeForm
        isOpen={showRecipeForm}
        onClose={() => setShowRecipeForm(false)}
        onSubmit={handleCreateRecipe}
        isLoading={isCreating}
      />

      <AIGenerateModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateRecipe}
        isLoading={isGenerating}
      />

      {/* Toast Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

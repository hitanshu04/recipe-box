import { useState, useEffect, useCallback } from "react";

/**
 * Custom debounce hook
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms per PRD)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for managing recipes state
 */
export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateRecipe = useCallback((id, updates) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updates } : recipe
      )
    );
  }, []);

  const addRecipe = useCallback((recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
  }, []);

  const removeRecipe = useCallback((id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  }, []);

  return {
    recipes,
    setRecipes,
    loading,
    setLoading,
    error,
    setError,
    updateRecipe,
    addRecipe,
    removeRecipe,
  };
}

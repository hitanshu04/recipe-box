const express = require("express");
const prisma = require("../lib/prisma");
const { getDishImage } = require("../services/imageService");

const router = express.Router();

// Available cuisines for validation
const CUISINES = ["Indian", "Chinese", "Italian", "Mexican", "American", "Other"];

/**
 * GET /api/recipes
 * Get all recipes with search and filter support
 * 
 * Query Parameters:
 * - search: Search in name and ingredients (Pattern 2)
 * - cuisine: Filter by cuisine type (Pattern 1)
 * - favorite: Filter by favorite status
 */
router.get("/", async (req, res) => {
  try {
    const { search, cuisine, favorite } = req.query;

    // Build the where clause
    const where = {};

    // Pattern 1: Cuisine filtering
    // Only filter if cuisine is provided and is not "All"
    if (cuisine && cuisine !== "All") {
      where.cuisine = cuisine;
    }

    // Pattern 2: Search in name and ingredients using OR
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { ingredients: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by favorite status
    if (favorite === "true") {
      where.isFavorite = true;
    } else if (favorite === "false") {
      where.isFavorite = false;
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      results: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recipes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/recipes/:id
 * Get a single recipe by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    res.json({
      status: "success",
      data: recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recipe",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/recipes
 * Create a new recipe
 */
router.post("/", async (req, res) => {
  try {
    const { name, ingredients, steps, cookingTime, cuisine, isAiGenerated } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Recipe name is required",
      });
    }

    if (!ingredients || !ingredients.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Ingredients are required",
      });
    }

    if (!steps || !steps.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Cooking steps are required",
      });
    }

    if (!cookingTime || cookingTime < 1) {
      return res.status(400).json({
        status: "error",
        message: "Valid cooking time is required (minimum 1 minute)",
      });
    }

    // Validate cuisine if provided
    const validCuisine = cuisine && CUISINES.includes(cuisine) ? cuisine : "Indian";

    // Fetch image for the dish
    const imageUrl = await getDishImage(name.trim(), validCuisine);

    const recipe = await prisma.recipe.create({
      data: {
        name: name.trim(),
        ingredients: ingredients.trim(),
        steps: steps.trim(),
        cookingTime: parseInt(cookingTime, 10),
        cuisine: validCuisine,
        imageUrl: imageUrl,
        isAiGenerated: isAiGenerated || false,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create recipe",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * PUT /api/recipes/:id
 * Update a recipe
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ingredients, steps, cookingTime, cuisine } = req.body;

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingRecipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    // Build update data (only include provided fields)
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (ingredients !== undefined) updateData.ingredients = ingredients.trim();
    if (steps !== undefined) updateData.steps = steps.trim();
    if (cookingTime !== undefined) updateData.cookingTime = parseInt(cookingTime, 10);
    if (cuisine !== undefined && CUISINES.includes(cuisine)) {
      updateData.cuisine = cuisine;
    }

    const recipe = await prisma.recipe.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.json({
      status: "success",
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update recipe",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * PUT /api/recipes/:id/favorite
 * Toggle favorite status (Pattern 5)
 */
router.put("/:id/favorite", async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the current recipe to read its isFavorite status
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    // Pattern 5: Toggle the isFavorite status
    const updatedRecipe = await prisma.recipe.update({
      where: { id: parseInt(id, 10) },
      data: { isFavorite: !recipe.isFavorite },
    });

    res.json({
      status: "success",
      message: updatedRecipe.isFavorite
        ? "Recipe added to favorites"
        : "Recipe removed from favorites",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to toggle favorite status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * DELETE /api/recipes/:id
 * Delete a recipe
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingRecipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    await prisma.recipe.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({
      status: "success",
      message: "Recipe deleted successfully",
      data: { id: parseInt(id, 10) },
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete recipe",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/recipes/meta/cuisines
 * Get list of available cuisines
 */
router.get("/meta/cuisines", async (req, res) => {
  res.json({
    status: "success",
    data: CUISINES,
  });
});

module.exports = router;

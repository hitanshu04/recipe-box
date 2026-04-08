const express = require("express");
const { PromptTemplate } = require("@langchain/core/prompts");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { getDishImage } = require("../services/imageService");

const router = express.Router();

// Available cuisines
const CUISINES = ["Indian", "Chinese", "Italian", "Mexican", "American", "Other"];

// Zod schema to validate LLM output
const recipeOutputSchema = z.object({
  name: z.string().min(1).max(150),
  ingredients: z.string().min(1).max(1000),
  steps: z.string().min(1).max(2000),
  cookingTime: z.number().int().min(1).max(1440),
  cuisine: z.enum(["Indian", "Chinese", "Italian", "Mexican", "American", "Other"]),
});

// Prompt template for recipe generation
const recipePromptTemplate = PromptTemplate.fromTemplate(`
You are a professional chef assistant. Based on the ingredients provided, create a delicious recipe.

INGREDIENTS PROVIDED BY USER:
{ingredients}

PREFERRED CUISINE (optional): {cuisine}

YOU MUST RESPOND WITH ONLY A VALID JSON OBJECT IN THIS EXACT FORMAT (no markdown, no code blocks, just raw JSON):
{{
  "name": "Recipe Name Here",
  "ingredients": "ingredient 1\\ningredient 2\\ningredient 3\\n...",
  "steps": "Step 1: Do this\\nStep 2: Do that\\nStep 3: Continue...",
  "cookingTime": 30,
  "cuisine": "Italian"
}}

CRITICAL RULES:
1. "name" must be a creative, descriptive recipe name (max 150 characters)
2. "ingredients" must be a SINGLE STRING with ingredients separated by newlines (\\n), include quantities
3. "steps" must be a SINGLE STRING with numbered steps separated by newlines (\\n)
4. "cookingTime" must be a realistic number in MINUTES (integer between 1 and 1440)
5. "cuisine" must be exactly one of: Indian, Chinese, Italian, Mexican, American, Other
6. Use the provided ingredients creatively, you may suggest additional common ingredients
7. DO NOT use arrays - ingredients and steps must be single strings with \\n separators
8. DO NOT wrap in markdown code blocks - output raw JSON only

Generate the recipe now:
`);

/**
 * Parse and clean JSON from LLM response
 * Handles markdown code blocks and other common issues
 */
function parseJsonFromLLM(content) {
  let cleanContent = content.trim();
  
  // Remove markdown code blocks if present
  if (cleanContent.startsWith("```json")) {
    cleanContent = cleanContent.slice(7);
  } else if (cleanContent.startsWith("```")) {
    cleanContent = cleanContent.slice(3);
  }
  
  if (cleanContent.endsWith("```")) {
    cleanContent = cleanContent.slice(0, -3);
  }
  
  cleanContent = cleanContent.trim();
  
  // Try to find JSON object in the content
  const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanContent = jsonMatch[0];
  }
  
  return JSON.parse(cleanContent);
}

/**
 * Get the appropriate LLM model based on available API keys
 * Priority: Groq (free) > OpenAI
 */
async function getLLMModel() {
  // Try Groq first (free tier available)
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_api_key_here") {
    const { ChatGroq } = require("@langchain/groq");
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant", // Use 'model' not 'modelName' for Groq
      temperature: 0.7,
    });
  }
  
  // Fall back to OpenAI
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
    const { ChatOpenAI } = require("@langchain/openai");
    return new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  return null;
}

/**
 * POST /api/recipes/generate
 * Generate a recipe using AI based on provided ingredients
 */
router.post("/", async (req, res) => {
  try {
    const { ingredients, cuisine } = req.body;

    // Validate input
    if (!ingredients || (Array.isArray(ingredients) && ingredients.length === 0)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide at least one ingredient",
      });
    }

    // Handle both array and string input for ingredients
    const ingredientList = Array.isArray(ingredients)
      ? ingredients.join(", ")
      : ingredients;

    // Validate cuisine if provided
    const preferredCuisine = cuisine && CUISINES.includes(cuisine) 
      ? cuisine 
      : "Any (chef's choice)";

    // Get LLM model
    const model = await getLLMModel();
    
    if (!model) {
      return res.status(500).json({
        status: "error",
        message: "No AI API key configured. Please set GROQ_API_KEY (free) or OPENAI_API_KEY in .env file.",
        hint: "Get a free Groq API key at: https://console.groq.com/keys",
      });
    }

    // Format the prompt
    const formattedPrompt = await recipePromptTemplate.format({
      ingredients: ingredientList,
      cuisine: preferredCuisine,
    });

    // Retry logic for LLM hallucinations
    const MAX_RETRIES = 3;
    let lastError = null;
    let recipeData = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`AI Generation attempt ${attempt}/${MAX_RETRIES}`);
        
        // Call the LLM
        const response = await model.invoke(formattedPrompt);
        const content = response.content;

        console.log("Raw LLM response:", content);

        // Parse JSON from response
        const parsedJson = parseJsonFromLLM(content);
        
        // Validate with Zod
        recipeData = recipeOutputSchema.parse(parsedJson);
        
        console.log("Validated recipe data:", recipeData);
        break; // Success, exit retry loop
        
      } catch (parseError) {
        console.error(`Attempt ${attempt} failed:`, parseError.message);
        lastError = parseError;
        
        if (attempt === MAX_RETRIES) {
          throw new Error(`Failed to generate valid recipe after ${MAX_RETRIES} attempts: ${lastError.message}`);
        }
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Fetch an image for the recipe
    const imageUrl = await getDishImage(recipeData.name, recipeData.cuisine);

    // Save to database with isAiGenerated flag
    const recipe = await prisma.recipe.create({
      data: {
        name: recipeData.name,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        cookingTime: recipeData.cookingTime,
        cuisine: recipeData.cuisine,
        isAiGenerated: true,
        imageUrl: imageUrl,
      },
    });

    res.status(201).json({
      status: "success",
      message: "AI recipe generated and saved successfully",
      data: recipe,
    });

  } catch (error) {
    console.error("Error generating recipe:", error);
    
    // Handle specific error types
    if (error.message?.includes("API key") || error.message?.includes("api_key")) {
      return res.status(500).json({
        status: "error",
        message: "Invalid API key. Please check your configuration.",
      });
    }
    
    if (error.message?.includes("rate limit") || error.message?.includes("quota")) {
      return res.status(429).json({
        status: "error",
        message: "AI service quota exceeded. Try using Groq (free): https://console.groq.com/keys",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message || "Failed to generate recipe",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;

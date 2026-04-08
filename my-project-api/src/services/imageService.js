/**
 * Image Service - Fetches food images from Unsplash
 * Uses Unsplash Source API (no API key required for basic usage)
 */

/**
 * Get a food image URL for a dish name
 * Uses Unsplash Source API which provides random images based on search terms
 * 
 * @param {string} dishName - Name of the dish
 * @param {string} cuisine - Cuisine type for better results
 * @returns {string} - Image URL
 */
function getUnsplashImageUrl(dishName, cuisine = "") {
  // Clean the dish name for URL
  const searchTerms = [
    dishName.toLowerCase().replace(/[^a-z0-9\s]/g, ""),
    cuisine.toLowerCase(),
    "food",
    "dish"
  ].filter(Boolean).join(",");
  
  // Unsplash Source API - free, no key needed
  // Returns a random image matching the search terms
  // Using 800x600 for good quality without being too large
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(searchTerms)}`;
}

/**
 * Fetch image from Pexels-style free API or fallback
 * This function tries multiple sources to ensure we get an image
 * 
 * @param {string} dishName - Name of the dish
 * @param {string} cuisine - Cuisine type
 * @returns {Promise<string>} - Image URL
 */
async function fetchDishImage(dishName, cuisine = "") {
  try {
    // Primary: Use Unsplash Source (always works, no API key)
    const unsplashUrl = getUnsplashImageUrl(dishName, cuisine);
    
    // Verify the URL resolves (optional, for production you might want to skip this)
    // For now, we'll just return the Unsplash Source URL as it's reliable
    return unsplashUrl;
    
  } catch (error) {
    console.error("Error fetching dish image:", error);
    // Return a generic food placeholder
    return getPlaceholderImage(cuisine);
  }
}

/**
 * Get a placeholder image based on cuisine type
 * @param {string} cuisine - Cuisine type
 * @returns {string} - Placeholder image URL
 */
function getPlaceholderImage(cuisine) {
  const cuisineImages = {
    Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    Chinese: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop",
    Italian: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&h=600&fit=crop",
    Mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop",
    American: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    Other: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  };
  
  return cuisineImages[cuisine] || cuisineImages.Other;
}

/**
 * Get a specific, high-quality image for common dishes
 * This provides more accurate images for well-known dishes
 * 
 * @param {string} dishName - Name of the dish
 * @returns {string|null} - Image URL or null if not found
 */
function getKnownDishImage(dishName) {
  const lowerName = dishName.toLowerCase();
  
  // Map of known dishes to specific high-quality images
  const knownDishes = {
    "butter chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
    "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
    "pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop",
    "pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    "tacos": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop",
    "sushi": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    "fried rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
    "noodles": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
    "curry": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
    "salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    "soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
    "steak": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop",
    "chicken": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop",
    "sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop",
    "bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
    "cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    "pancakes": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
    "eggs": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop",
    "omelette": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop",
    "rice": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop",
    "dal": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
    "paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop",
    "masala": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
    "chai": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop",
    "tea": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=600&fit=crop",
    "coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
  };
  
  // Check if any known dish keyword is in the name
  for (const [keyword, url] of Object.entries(knownDishes)) {
    if (lowerName.includes(keyword)) {
      return url;
    }
  }
  
  return null;
}

/**
 * Main function to get the best image for a dish
 * 
 * @param {string} dishName - Name of the dish
 * @param {string} cuisine - Cuisine type
 * @returns {Promise<string>} - Best available image URL
 */
async function getDishImage(dishName, cuisine = "") {
  // First, check if we have a known high-quality image
  const knownImage = getKnownDishImage(dishName);
  if (knownImage) {
    return knownImage;
  }
  
  // Otherwise, fetch from Unsplash
  return fetchDishImage(dishName, cuisine);
}

module.exports = {
  getDishImage,
  getUnsplashImageUrl,
  getPlaceholderImage,
  getKnownDishImage,
};

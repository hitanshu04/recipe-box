const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleRecipes = [
  {
    name: "Butter Chicken",
    ingredients:
      "500g chicken breast\n2 tbsp butter\n1 cup tomato puree\n1/2 cup heavy cream\n2 tsp garam masala\n1 tsp turmeric\n1 tsp cumin\nSalt to taste\nFresh cilantro for garnish",
    steps:
      "1. Cut chicken into bite-sized pieces and marinate with yogurt and spices for 30 minutes.\n2. Heat butter in a large pan over medium heat.\n3. Add marinated chicken and cook until golden brown.\n4. Pour in tomato puree and simmer for 15 minutes.\n5. Stir in heavy cream and cook for another 5 minutes.\n6. Garnish with fresh cilantro and serve with naan or rice.",
    cookingTime: 45,
    cuisine: "Indian",
    isFavorite: true,
    isAiGenerated: false,
  },
  {
    name: "Spaghetti Carbonara",
    ingredients:
      "400g spaghetti\n200g pancetta or guanciale\n4 egg yolks\n100g Pecorino Romano cheese\n50g Parmesan cheese\nFreshly ground black pepper\nSalt for pasta water",
    steps:
      "1. Boil spaghetti in salted water until al dente.\n2. While pasta cooks, fry pancetta until crispy.\n3. Mix egg yolks with grated cheeses and pepper.\n4. Drain pasta, reserving 1 cup pasta water.\n5. Toss hot pasta with pancetta off heat.\n6. Add egg mixture, tossing quickly to create creamy sauce.\n7. Add pasta water if needed to loosen.\n8. Serve immediately with extra cheese and pepper.",
    cookingTime: 25,
    cuisine: "Italian",
    isFavorite: false,
    isAiGenerated: false,
  },
  {
    name: "Chicken Fried Rice",
    ingredients:
      "3 cups day-old rice\n2 chicken breasts, diced\n3 eggs, beaten\n1 cup mixed vegetables (peas, carrots, corn)\n3 tbsp soy sauce\n2 tbsp sesame oil\n3 green onions, chopped\n2 cloves garlic, minced",
    steps:
      "1. Heat sesame oil in a wok over high heat.\n2. Scramble eggs and set aside.\n3. Stir-fry chicken until cooked through, set aside.\n4. Sauté garlic and vegetables for 2 minutes.\n5. Add cold rice and stir-fry for 3-4 minutes.\n6. Return chicken and eggs to wok.\n7. Add soy sauce and toss everything together.\n8. Garnish with green onions and serve hot.",
    cookingTime: 20,
    cuisine: "Chinese",
    isFavorite: true,
    isAiGenerated: false,
  },
  {
    name: "Classic Tacos",
    ingredients:
      "500g ground beef\n1 packet taco seasoning\n12 taco shells\n2 cups shredded lettuce\n1 cup diced tomatoes\n1 cup shredded cheddar cheese\n1/2 cup sour cream\n1/2 cup salsa\nFresh cilantro",
    steps:
      "1. Brown ground beef in a skillet over medium-high heat.\n2. Drain excess fat and add taco seasoning with water.\n3. Simmer for 5 minutes until sauce thickens.\n4. Warm taco shells according to package directions.\n5. Fill shells with seasoned beef.\n6. Top with lettuce, tomatoes, cheese, sour cream, and salsa.\n7. Garnish with fresh cilantro and serve.",
    cookingTime: 25,
    cuisine: "Mexican",
    isFavorite: false,
    isAiGenerated: false,
  },
  {
    name: "Classic Cheeseburger",
    ingredients:
      "500g ground beef (80/20)\n4 brioche buns\n4 slices cheddar cheese\n4 lettuce leaves\n1 tomato, sliced\n1 onion, sliced\nPickles\nKetchup and mustard\nSalt and pepper",
    steps:
      "1. Divide beef into 4 equal patties, season with salt and pepper.\n2. Heat grill or skillet over high heat.\n3. Cook patties 3-4 minutes per side for medium.\n4. Add cheese in last minute of cooking.\n5. Toast buns lightly on the grill.\n6. Assemble burgers with lettuce, tomato, onion, and pickles.\n7. Add ketchup and mustard to taste.\n8. Serve with fries.",
    cookingTime: 20,
    cuisine: "American",
    isFavorite: true,
    isAiGenerated: false,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing recipes
  await prisma.recipe.deleteMany();
  console.log("Cleared existing recipes");

  // Insert sample recipes
  for (const recipe of sampleRecipes) {
    await prisma.recipe.create({ data: recipe });
  }

  console.log(`✅ Seeded ${sampleRecipes.length} recipes`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

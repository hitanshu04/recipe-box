-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "ingredients" VARCHAR(1000) NOT NULL,
    "steps" VARCHAR(2000) NOT NULL,
    "cookingTime" INTEGER NOT NULL,
    "cuisine" TEXT NOT NULL DEFAULT 'Indian',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

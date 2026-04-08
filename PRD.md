# RecipeBox — Product Requirements Document (PRD)
## Autonomous AI Kitchen Assistant

---

## 1. Project Overview & Meta-Context

| Field | Details |
|---|---|
| **Lead Engineer** | Hitanshu Kumar Singh |
| **Project Name** | RecipeBox (Autonomous AI Kitchen Assistant) |
| **Tech Stack** | Next.js (App Router, Tailwind CSS), Node.js (Express), MongoDB Atlas (Mongoose), LangChain.js |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas (Database) |

**Objective:** Build a 1000% optimized, production-grade MERN application in a single sprint. The AI coding assistant must strictly follow this document to build a fault-tolerant system handling race conditions, AI hallucinations, and optimal database querying.

---

## 2. Core Requirements (Baseline)

The system **MUST** support the following core features without exception:

- Add recipe (name, ingredients, steps, cooking time, cuisine type).
- Filter by cuisine (Indian, Chinese, Italian, Mexican, American, Other).
- Search by recipe name or ingredient.
- Mark favorites.
- Delete recipes.

---

## 3. Layer 3: Database & Schema (MongoDB/Mongoose)

The AI must implement the exact schema below, incorporating enterprise best practices.

### The Strict Schema

| Field | Type | Constraints |
|---|---|---|
| `_id` | Auto-generated | Fulfilled automatically by MongoDB |
| `name` | String | Required, trimmed, max length 100 |
| `ingredients` | Array of Strings | Required, validate length > 0 |
| `steps` | Array of Strings | Required |
| `cookingTime` | Number | Required, min 1, max 1440 minutes |
| `cuisine` | String | Required, Enum: `['Indian', 'Chinese', 'Italian', 'Mexican', 'American', 'Other']` |
| `isFavorite` | Boolean | Default: `false` |
| `createdAt` | Date | Handled automatically by Mongoose `timestamps: true` |
| `isAiGenerated` | Boolean | **AI Extension** — Default: `false` |
| `isDeleted` | Boolean | **Enterprise Extension** — Default: `false`, `select: false` |

### Database Optimizations to Implement

**Text Index:**
Create a compound text index on `{ name: 'text', ingredients: 'text' }` for lightning-fast search.

**Soft Deletes:**
The delete route must **NOT** hard delete. It must update `isDeleted: true`. Create a Mongoose pre-hook (`pre(/^find/)`) to filter out `isDeleted: true` from all GET queries.

**Query Projections:**
The GET all recipes route must **ONLY** return `_id`, `name`, `cookingTime`, `cuisine`, `isFavorite`. Do not return the massive `ingredients` or `steps` arrays unless fetching a single specific recipe by ID — to prevent payload bloat.

---

## 4. Layer 2: The API & Logic Layer (Node.js + Express)

The backend must be a fortress. Implement the following routes and middleware:

### Standard Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/recipes` | Create a new recipe |
| `GET` | `/api/recipes` | Get all recipes. Must support query params `?search=xyz` (using `$text` search) and `?cuisine=xyz` |
| `PUT` | `/api/recipes/:id/favorite` | Toggle `isFavorite` — idempotent |
| `DELETE` | `/api/recipes/:id` | Soft delete only — sets `isDeleted: true` |

### The AI Route (The "Wow" Feature)

**Endpoint:** `POST /api/recipes/generate`

**Logic:**
1. Receive an array of ingredients from the frontend (e.g., `["chicken", "rice"]`).
2. Use LangChain.js and an LLM to generate a recipe.
3. The LLM prompt **MUST** enforce returning a strict JSON object matching the exact Mongoose schema.
4. Automatically save the generated recipe to MongoDB, flagged with `isAiGenerated: true`.
5. Return the saved recipe to the frontend.

### Backend Optimizations & Edge Cases

**Global Error Handler:**
Wrap all routes in `try/catch` or an `asyncHandler`. Never crash the server. Return standardized JSON errors:
```json
{ "status": "error", "message": "..." }
```

**AI Validation:**
Use **Zod** to validate the LLM's JSON output before saving it to the database. If the LLM hallucinates bad data, catch the error gracefully.

**Rate Limiting:**
Implement `express-rate-limit` globally, with a stricter limit specifically on the `/api/recipes/generate` route.

---

## 5. Layer 1: Presentation Layer (Next.js App Router)

The frontend must feel instant and handle all edge cases smoothly.

### UI Components

| Component | Description |
|---|---|
| **Dashboard** | Grid of recipe cards |
| **Smart Search Bar** | Must implement a **300ms debounce** to prevent spamming the backend |
| **Filter Pills** | Clickable tags for the Cuisine Enums |
| **Pantry AI Modal** | A button to input random ingredients and call the AI Generate route |

### Frontend Optimizations & Edge Cases

**React Query:**
Use `@tanstack/react-query` for all data fetching.

**Optimistic UI:**
When the user clicks the "Favorite" button, the UI must update to "favorited" **instantly**, before the server responds. Rollback on error.

**Form Validation:**
Use `react-hook-form` and `zod` to validate the "Add Recipe" inputs on the client side before sending the POST request.

**Loading & Empty States:**
- Show a **skeleton loader** while the AI is generating.
- If a search returns no results, show a polished "No recipes found" component.

**Button Disabling:**
Disable submit/generate buttons immediately upon click (`isLoading = true`) to prevent duplicate database entries from double-clicks.

---

## 6. Execution Instructions for the AI Assistant

Build this project in the following **strict order**:

1. Initialize the Next.js frontend and Node/Express backend.
2. Build the Mongoose Schema and the Express CRUD routes (Layer 3 & 2).
3. Implement the LangChain.js AI generation route.
4. Build the Next.js UI using Tailwind CSS and React Query (Layer 1).
5. Ensure all code is ready to be deployed to Vercel (frontend) and Render (backend) with `process.env` variables mapped correctly.

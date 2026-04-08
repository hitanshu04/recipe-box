# RecipeBox - AI Kitchen Assistant

A full-stack recipe management application with AI-powered recipe generation using LangChain.js.

## Features

- **AI Recipe Generation** - Generate recipes from ingredients using Groq LLM (LLaMA 3.1)
- **CRUD Operations** - Create, read, update, delete recipes
- **Smart Search** - Search recipes by name or ingredients (debounced)
- **Cuisine Filter** - Filter by Indian, Chinese, Italian, Mexican, American, Other
- **Favorites** - Mark recipes as favorites with optimistic UI updates
- **Auto Images** - Automatic dish images from Unsplash
- **Dark Mode** - Toggle between light and dark themes
- **Loading Skeletons** - Smooth loading states
- **Toast Notifications** - Success/error feedback
- **Confirm Dialogs** - Safe delete confirmations
- **Empty States** - Friendly UI when no recipes found

## Tech Stack

### Backend (`my-project-api/`)
- **Express.js** - REST API server
- **Prisma ORM** - Database access with PostgreSQL
- **LangChain.js** - AI/LLM integration
- **Groq** - Free LLM API (LLaMA 3.1)
- **Zod** - Schema validation

### Frontend (`my-project-client/`)
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use [Neon](https://neon.tech) for free)
- Groq API key (free at [console.groq.com](https://console.groq.com/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hitanshu04/recipe-box.git
   cd recipe-box
   ```

2. **Setup Backend**
   ```bash
   cd my-project-api
   npm install
   
   # Copy environment file and add your keys
   cp .env.example .env
   # Edit .env with your DATABASE_URL and GROQ_API_KEY
   
   # Generate Prisma client and push schema
   npx prisma generate
   npx prisma db push
   
   # Start server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd my-project-client
   npm install
   npm run dev
   ```

4. **Open the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes (supports `?search=`, `?cuisine=`, `?favorite=`) |
| GET | `/api/recipes/:id` | Get single recipe |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| PATCH | `/api/recipes/:id/favorite` | Toggle favorite |
| POST | `/api/recipes/generate` | AI generate recipe |

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# AI (Groq is FREE!)
GROQ_API_KEY="your_groq_api_key"

# Server
PORT=5000
NODE_ENV="development"
```

## Project Structure

```
recipe-box/
├── my-project-api/          # Express backend
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── recipeRoutes.js
│   │   │   └── generateRoutes.js
│   │   ├── services/
│   │   │   └── imageService.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   └── server.js
│   └── package.json
│
├── my-project-client/       # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## Screenshots

### Light Mode
Add and manage recipes with a clean, modern interface.

### Dark Mode
Full dark mode support for comfortable viewing.

### AI Generation
Generate recipes by entering available ingredients.

## License

MIT

## Author

**Hitanshu** - [GitHub](https://github.com/hitanshu04)

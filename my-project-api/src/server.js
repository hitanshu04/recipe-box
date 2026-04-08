require("dotenv").config();

const express = require("express");
const cors = require("cors");
const recipeRoutes = require("./routes/recipeRoutes");
const generateRoutes = require("./routes/generateRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "RecipeBox API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/recipes/generate", generateRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🍳 RecipeBox API Server                                 ║
║                                                           ║
║   Environment: ${(process.env.NODE_ENV || "development").padEnd(40)}║
║   Port: ${String(PORT).padEnd(47)}║
║   Health: http://localhost:${PORT}/api/health               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;

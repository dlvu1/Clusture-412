const express = require("express");
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Import user routes
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// Import board routes
const boardRoutes = require("./routes/boards");
app.use("/boards", boardRoutes);

// Import pins routes
const pinRoutes = require("./routes/pins");
app.use("/pins", pinRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

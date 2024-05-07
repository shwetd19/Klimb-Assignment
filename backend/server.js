const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const candidateRoutes = require("./routes/candidateRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use("/candidates", candidateRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

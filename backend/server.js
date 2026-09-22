import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { seedCatalog } from "./src/services/catalog.service.js";

// Start the server
const PORT = process.env.PORT || 3000;

// Connect to the database and then start the server
connectDB()
  .then(() => {
    return seedCatalog();
  })
  .then(() => {
    console.log("Velmora catalog synchronized");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });

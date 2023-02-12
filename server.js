const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config();
const { HOST_URI } = process.env;

(async function () {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Connection failed", error.message);
    process.exit(1);
  }
})();

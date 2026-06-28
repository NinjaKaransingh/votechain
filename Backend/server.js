const express = require("express"); //framework of node
const cors = require("cors"); //to allow frontend to interact with backend
const dotenv = require("dotenv"); //to load all the env
const connectDB = require("./config/db.js");

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//connect to DB
connectDB()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

// connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Voting API is running...!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

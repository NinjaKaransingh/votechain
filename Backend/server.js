const express = require("express"); //framework of node
const cors = require("cors"); //to allow frontend to interact with backend
const dotenv = require("dotenv"); //to load all the env
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoutes.js");
const candidateRoutes = require("./routes/candidateRoutes.js");
const pollRoutes = require("./routes/pollRoutes.js");
const voteRoutes = require("./routes/voteRoutes.js");

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//connect to DB
connectDB()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Voting API is running...!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

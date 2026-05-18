require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const executionRoutes = require("./modules/execution/execution.controller");
const authRoutes = require("./modules/auth/auth.controller");
const roomRoutes = require("./modules/room/room.controller");
const userRoutes = require("./modules/user/user.controller");
const friendsRoutes = require("./modules/friends/friends.controller");

const app = express();
app.set('trust proxy', 1);
const passport = require('./config/passport');

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/execute", executionRoutes);
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/user", userRoutes);
app.use("/friends", friendsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
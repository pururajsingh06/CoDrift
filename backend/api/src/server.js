require('dotenv').config();
const express = require("express");
const cors = require("cors");

const executionRoutes = require("./modules/execution/execution.controller");
const authRoutes = require("./modules/auth/auth.controller");
const roomRoutes = require("./modules/room/room.controller");
const userRoutes = require("./modules/user/user.controller");
const friendsRoutes = require("./modules/friends/friends.controller");

const app = express();
const passport = require('./config/passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/execute", executionRoutes);
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/user", userRoutes);
app.use("/friends", friendsRoutes);

app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});
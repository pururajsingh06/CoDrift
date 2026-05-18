require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const Y = require('yjs');
const { setupWSConnection, setPersistence } = require("y-websocket/bin/utils");
const { LeveldbPersistence } = require('y-leveldb');
const path = require('path');
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

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

const dbPath = path.join(__dirname, '../../.y-leveldb-data');
const ldb = new LeveldbPersistence(dbPath);

setPersistence({
  bindState: async (docName, ydoc) => {
    const persistedYdoc = await ldb.getYDoc(docName);
    const newUpdates = Y.encodeStateAsUpdate(ydoc);
    ldb.storeUpdate(docName, newUpdates);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
    ydoc.on('update', update => {
      ldb.storeUpdate(docName, update);
    });
  },
  writeState: async (docName, ydoc) => {
    return Promise.resolve();
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`API and Realtime WebSocket server running on port ${PORT}`);
});
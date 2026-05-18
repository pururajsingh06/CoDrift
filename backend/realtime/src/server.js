const http = require("http");
const WebSocket = require("ws");
const Y = require('yjs');
const { setupWSConnection, setPersistence } = require("y-websocket/bin/utils");
const { LeveldbPersistence } = require('y-leveldb');
const path = require('path');

const dbPath = path.join(__dirname, '../.y-leveldb-data');
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

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

server.listen(1234, () => {
  console.log("Yjs WebSocket server with LevelDB persistence running on ws://localhost:1234");
});
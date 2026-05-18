import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export const createYjs = (roomId) => {
  const doc = new Y.Doc();

  const provider = new WebsocketProvider(
    "ws://127.0.0.1:1234", 
    roomId,
    doc
  );

  provider.on("status", (event) => {
    console.log("Yjs status:", event.status);
  });

  provider.on("connection-error", (err) => {
    console.error("WebSocket error:", err);
  });

  const yText = doc.getText("monaco");

  return { doc, provider, yText };
};
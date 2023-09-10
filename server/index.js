import { Server } from "socket.io";
import dotenv from "dotenv";
import Connection from "./Database/db.js";
import { getDocument, updateDocument } from "./Controller/Doc_controller.js";
dotenv.config();
const PORT = process.env.PORT || 9000;

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  try {
    console.log("connected");
    // Receiving the particular ID  from the client side
    socket.on("get-document", async (documentId) => {
      const document = await getDocument(documentId);
      socket.join(documentId); //allow to join only that room that is associated with given ID.
      socket.emit("load-document", document.data);

      socket.on("send-Changes", (delta) => {
        //receiving changed data from the client side
        console.log(delta);
        socket.broadcast.to(documentId).emit("received-changes", delta); //broadcasting or sending same data to the client side
      });
      socket.on("save-document", async (data) => {
        await updateDocument(documentId, data);
      });
    });
  } catch (error) {
    console.log(error);
  }
});

Connection();

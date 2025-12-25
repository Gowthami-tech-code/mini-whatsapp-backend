// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("send_message", (data) => {
//     console.log("Message received:", data);
//     io.emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("users_list", Object.values(users));
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", {
      user: users[socket.id],
      text: data.text,
      id: socket.id
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("users_list", Object.values(users));
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

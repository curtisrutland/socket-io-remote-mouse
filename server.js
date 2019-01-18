const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const createUUID = require("uuid/v4");

app.use(express.static(__dirname + "/public"));

app.get("*", (_, res) => {
    const indexHtml = path.resolve(__dirname, "public", "index.html")
    res.sendFile(indexHtml);
});

io.on("connection", socket => {
    const id = createUUID();
    socket.broadcast.emit("client connected", { id });
    socket.on("disconnect", () => {
        socket.broadcast.emit("client disconnected", { id });
    });
    socket.on("mouse move", ({ x, y }) => {
        socket.broadcast.emit("mouse move", { id, x, y });
    });
    socket.on("mouse state change", ({ state }) => {
        console.log("state changed");
        socket.broadcast.emit("mouse state change", { id, state });
    });
})

http.listen("3000", () => {
    console.log("listening on :3000");
})
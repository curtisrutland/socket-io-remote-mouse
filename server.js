const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const createUUID = require("uuid/v4");
const port = process.env.port || 3000;

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
        socket.broadcast.emit("mouse state change", { id, state });
    });
})

http.listen(port, () => {
    console.log("listening on http://localhost:3000");
})
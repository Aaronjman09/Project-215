const express = require("express");
const app = express();
const server = require("http").Server(app);
const {ExpressPeerServer} = require("Peer")
const peerServer = ExpressPeerServer(server, {debug: true,})
app.use("/peerJs", peerServer)
app.set("view engine", "ejs");
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("message", (message) => {
        io.emit("createMessage", message);
    });
});

server.listen(3030);
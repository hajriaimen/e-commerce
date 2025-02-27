"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOption = {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(bodyParser.json());
app.use(cors(corsOption));
const port = process.env.PORT || 3000;
const posts = {};
app.get("/posts", (req, res) => {
    console.log("post : ", posts);
    res.send(posts);
});
app.post("/events", (req, res) => {
    const { type, data } = req.body;
    if (type === "PostCreated") {
        console.log("Received Event", req.body.type);
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if (type === "CommentCreated") {
        console.log("Received Event", req.body.type);
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }
    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
    console.log("post : ", posts);
    res.send({});
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

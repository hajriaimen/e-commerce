"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
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
const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if (type === "CommentCreated") {
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
};
app.get("/posts", (req, res) => {
    console.log("post : ", posts);
    res.send(posts);
});
app.post("/events", (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({});
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    try {
        const res = yield axios.get("http://localhost:4005/events");
        for (let event of res.data) {
            console.log("Processing event:", event.type);
            handleEvent(event.type, event.data);
        }
    }
    catch (error) {
        console.log(error.message);
    }
}));

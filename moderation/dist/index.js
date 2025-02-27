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
const axios_1 = __importDefault(require("axios"));
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
app.post("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post : ", posts);
    const { type, data } = req.body;
    if (type === "CommentCreated") {
        const { id, content, postId } = data;
        const status = content.includes("orange") ? "rejected" : "approved";
        yield axios_1.default.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
                id,
                content,
                postId,
                status,
            },
        });
        //posts[postId].comments.push({ id, status, content });
    }
    res.send({});
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

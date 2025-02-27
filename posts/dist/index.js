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
const crypto = require("crypto");
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
app.get("/posts", (req, res) => {
    console.log("post : ", posts);
    res.send(posts);
});
app.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = crypto.randomUUID();
    const { title } = req.body;
    posts[id] = { id, title };
    yield axios.post("http://localhost:4005/events", {
        type: "PostCreated",
        data: {
            id,
            title,
        },
    }).catch((err) => {
        console.log(err.message);
    });
    ;
    res.status(201).send(posts[id]);
}));
app.post("/events", (req, res) => {
    console.log("Received Event", req.body.type);
    res.send({});
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

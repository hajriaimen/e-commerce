"use strict";
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
    origin: ['http://localhost:5173', 'http://localhost:4005'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(bodyParser.json());
app.use(cors(corsOption));
const port = process.env.PORT || 3000;
const posts = {};
const events = [];
app.post("/events", (req, res) => {
    const event = req.body;
    events.push(event);
    //comments
    axios.post("http://localhost:4001/events", event).catch((err) => {
        console.log(err.message);
    });
    //posts
    axios.post("http://localhost:4000/events", event).catch((err) => {
        console.log(err.message);
    });
    //query
    axios.post("http://localhost:4002/events", event).catch((err) => {
        console.log(err.message);
    });
    //moderation
    axios.post("http://localhost:4003/events", event).catch((err) => {
        console.log(err.message);
    });
    res.send({ status: 'OK' });
});
app.get("/events", (req, res) => {
    res.send(events);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

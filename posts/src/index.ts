import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const app: Express = express();

const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(bodyParser.json());

app.use(cors(corsOption));

const port = process.env.PORT || 3000;
const posts = {};

app.get("/posts", (req: Request, res: Response) => {
  console.log("post : ",posts);

  res.send(posts);
});

app.post("/posts/create", async(req: Request, res: Response) => {
  let id =   crypto.randomUUID(); 
  const { title } = req.body;
  posts[id] = { id, title };
  
  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  }).catch((err) => {
    console.log(err.message);
  });;

  res.status(201).send( posts[id]);
});
app.post("/events", (req: Request, res: Response) => {
    console.log("Received Event", req.body.type);
    res.send({}); 
})
app.listen(port, () => {
  console.log('version k8S latest');
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
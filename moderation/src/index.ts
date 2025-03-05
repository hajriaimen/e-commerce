import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.post("/events", async(req: Request, res: Response) => {
  console.log("post : ",posts);
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const status = content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id,
        content,
        postId,
        status,
      },
    })

    //posts[postId].comments.push({ id, status, content });
  }
  res.send({});
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}); 
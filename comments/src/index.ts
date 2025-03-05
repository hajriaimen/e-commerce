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
const commentsByPostId = {};


app.get("/posts/:id/comments", (req: Request, res: Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req: Request, res: Response) => {
  const commentId = crypto.randomUUID();
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  }).catch((err) => {
    console.log("post request comments",err.message);
  });

  res.status(201).send(comments);
});

app.post("/events", async(req: Request, res: Response) => {
  const { type, data } = req.body;

  if(type === "CommentModerated"){
    const {postId, id, status, content} = data;
    const comments =  commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status= status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: 'CommentUpdated',
      data: { 
        id,
        status,
        postId,
        content  
      }
    });
    }
  res.send({});
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
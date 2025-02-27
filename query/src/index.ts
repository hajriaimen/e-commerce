import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
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

const handleEvent =(type, data)=>{
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } 

  if (type === "CommentCreated") { 
      const { id, content, postId ,status } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status});
  }

  if (type === "CommentUpdated") {
    const {id, content, postId, status} = data;
    const post= posts[postId];
    const comment= post.comments.find(comment=>{
      return comment.id === id;
    });
    comment.status= status;
    comment.content= content;
  }
}

app.get("/posts", (req: Request, res: Response) => {
  console.log("post : ",posts);

  res.send(posts);
});

app.post("/events", (req: Request, res: Response) => {
    const { type, data } = req.body;
    handleEvent( type, data);
    res.send({}); 
})

app.listen(port, async() => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  try {
    const res = await axios.get("http://localhost:4005/events");
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
}); 
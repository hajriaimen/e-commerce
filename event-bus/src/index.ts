import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
dotenv.config();

const app: Express = express();

const corsOption = {
  origin: ['http://localhost:5173','http://localhost:4005'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(bodyParser.json());

app.use(cors(corsOption));

const port = process.env.PORT || 3000;
const posts = {};


app.post("/events", (req: Request, res: Response) => {
  const event = req.body;
  ; //comments
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
  
  res.send({status: 'OK'});
});


app.get("/posts", (req: Request, res: Response) => {
    console.log("post : ",posts);
  
    res.send(posts);
  });

  
  app.post("/events", (req: Request, res: Response) => {
    console.log("Received Event", req.body.type);
    res.send({}); 
})
  
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
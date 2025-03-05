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
const events= [];

app.post("/events", (req: Request, res: Response) => {
  const event = req.body;
  events.push(event);


  //posts
  axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
    console.log(err.message);
  }); 

   //comments
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log(err.message);
  });

  //query
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log(err.message);
  });

    //moderation
    axios.post("http://moderation-srv:4003/events", event).catch((err) => {
      console.log(err.message);
    });
  
  res.send({status: 'OK'});
});


app.get("/events", (req: Request, res: Response) => {
  res.send(events);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
import { Bot, InlineKeyboard } from "grammy";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userSchema";
import cors from "cors";
import { startWebSocketServer } from './websocket';
import http from 'http';
import Avatar from "./models/avatars";
import router from "./routes";
import bot from "./bot";

 

dotenv.config();

const app = express();

app.use(cors())

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded())

app.use("/",router);

const server = http.createServer(app);

// Listen for "/start" comman

server.listen(8000, async () => {
  console.log("Server is running on port 8000");
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    startWebSocketServer(server);
    bot.start();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});



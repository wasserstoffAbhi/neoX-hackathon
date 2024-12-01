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

 
let obj:any = {

}

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

const bot = new Bot(process.env.BOT_TOKEN || "");

// Listen for "/start" command
bot.command("start", async (ctx) => {
  const chatId = ctx.chat.id;
  console.log(chatId)
  const username = ctx.chat.username;
  const chat = await bot.api.getChat(chatId);
  console.log(chat)
  let user = await User.findOne({ chatId: chatId });
  
  if (!user) {
    user = new User({ chatId, username, points: 0 });
    await user.save();
    ctx.reply("Welcome! You are now registered.");
  } else {
    ctx.reply(
      `Welcome back, ${username || "user"}! You have ${user.points} points.`
    );
  }
  const keyboard = new InlineKeyboard().url(
    "🎮 Play Game",
    "https://hackathon-nine-eta.vercel.app/837414318" // replace your hosted game URL with the link
  );
  
  ctx.reply("Hello! I am your new bot. Would you like to play a game?", {
    reply_markup: keyboard,
  });
});

// Reply to any text message
bot.on("message:text", async(ctx) => {
  if(!obj.hasOwnProperty(ctx.chatId)) obj[ctx.chatId] = [];
  // Only store the recent 2 messages
  if(obj[ctx.chatId].length >= 2) obj[ctx.chatId].shift();
  obj[ctx.chatId].push(ctx.message.text);
  console.log(obj)

  // write a regex code to match the 32 biit hex string or 64 bit hex string and console it's type and it should start with 0x
  const regex64 = /0x[a-fA-F0-9]{64}/;
  const regex32 = /0x[a-fA-F0-9]{32}/;
  if(regex64.test(ctx.message.text)){
    ctx.reply("It's a 64 bit hex string")
  } else if(regex32.test(ctx.message.text)){
    ctx.reply("It's a 32 bit hex string")
  } else {
    ctx.reply("It's a 32 bit hex string")
  }

});

server.listen(8000, async () => {
  console.log("Server is running on port 8000");
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    // let avatar = [
    //   {
    //     url: "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_723.png",
    //     rank: 1,
    //     price: 100,
    //     rankType: "legendary"
    //   },
    //   {
    //     url: "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_721.png",
    //     rank: 3,
    //     price: 100,
    //     rankType: "common"
    //   },
    //   {
    //     url: "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_722.png",
    //     rank: 2,
    //     price: 100,
    //     rankType: "rare"
    //   },
    // ]
    // for(const ava of avatar){
    //   await new Avatar(ava).save();
    // }
    
    console.log("Connected to MongoDB");
    startWebSocketServer(server);
    bot.start();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});



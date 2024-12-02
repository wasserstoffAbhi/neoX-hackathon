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
import { avatars } from "./seed/rabbits";

 

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

// const createAvatars = async () => {
//   const data = [
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount11.jpeg", rank: 1, price: 0, rankType: "common" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount2.jpeg", rank: 2, price: 0, rankType: "rare" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount3.jpeg", rank: 3, price: 0, rankType: "common" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount4.jpeg", rank: 4, price: 0, rankType: "rare" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount5.jpeg", rank: 5, price: 0, rankType: "common" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount6.jpeg", rank: 6, price: 0, rankType: "rare" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount7.jpeg", rank: 7, price: 0, rankType: "common" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount8.jpeg", rank: 8, price: 0, rankType: "rare" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount9.jpeg", rank: 9, price: 0, rankType: "common" },
//     { url: "https://astrixcloud.blob.core.windows.net/astrix/_sudhanshu_s27/collectibles/20898188d6df1bb02206/collectibleCount10.jpeg", rank: 10, price: 0, rankType: "rare" }
//   ];

//   try {
//     await Avatar.insertMany(data);
//     console.log("Avatars created successfully!");
//   } catch (error) {
//     console.error("Error creating avatars:", error);
//   }
// };

// const createUser = async (userData: {
//   chatId: number;
//   username?: string;
//   walletAddress?: string;
//   activeAvatarId?: string;
//   avatar?: { id: string; count?: number }[];
//   unlocked?: { id: string; count?: number }[];
// }) => {
//   try {
//     const user = new User({
//       chatId: userData.chatId,
//       username: userData.username || "",
//       walletAddress: userData.walletAddress || "",
//       activeAvatarId: userData.activeAvatarId || null,
//       avatar: userData.avatar || [],
//       unlocked: userData.unlocked || [],
//     });

//     const savedUser = await user.save();
//     console.log("User created successfully:", savedUser);
//     return savedUser;
//   } catch (error) {
//     console.error("Error creating user:", error);
//     throw error;
//   }
// };

// const initializeUser = async () => {
//   const userData = {
//     chatId: 1222,
//     username: "JohnDoe",
//     walletAddress: "",
//     activeAvatarId: "", // Example Avatar ObjectId
//     avatar: [
//       { id: "674cb47cf1e81608f405bb30", count: 2 },
//       { id: "674cb6153a312e845c5bc336", count: 1 },
//     ],
//     unlocked: [
//       { id: "674cb6153a312e845c5bc338", count: 3 },
//     ],
//   };

//   try {
//     const newUser = await createUser(userData);
//     console.log("New user created:", newUser);
//   } catch (error) {
//     console.error("Failed to initialize user:", error);
//   }
// };


// Listen for "/start" comman

server.listen(8000, async () => {
  console.log("Server is running on port 8000");
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    // await createAvatars();
    // await initializeUser();
    startWebSocketServer(server);
    // for(const avatar of avatars){
    //   const newAvatar = new Avatar(avatar);
    //   await newAvatar.save();
    // } 
    bot.start();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});



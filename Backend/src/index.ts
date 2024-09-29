import { Bot, InlineKeyboard } from "grammy";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userSchema";
import { getTransactionInfo, transferAmount } from "./service/txnHash";
import { getTransactions } from "./service/walletAdd";
import cors from "cors";
import { startWebSocketServer } from './websocket';
import http from 'http';
import { finalChain, neoXRag, transactionDetails } from "./service/Agent";
import { queryFilter } from "./helper";
import Transaction from "./models/transactions";
 
let obj:any = {

}

let txnObj:any = {
}

dotenv.config();


const app = express();

app.use(cors())
app.use(express.json());

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded())

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

app.get("/", async (req, res) => {
  res.status(200).send("Server Running..!");
});

app.post("/userData", async (req, res) => {
  try {
    const chatId = req?.body?.chatId;
    console.log(chatId)
    const user = await User.findOne({ chatId: chatId });
    console.log(user)
    console.log(user?.points)
    res.status(200).send({points: user?.points || null});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

app.put("/update-points", async (req, res) => {
  const { chatId, points } = req.body;
  console.log(chatId, points,"..............")
  try {
    const user = await User.findOneAndUpdate(
      { chatId },
      { $set: { points : points } },
      { new: true }
    );

    if((points % 1000 ) == 0){
      // send The Transaction to user
      await User.findOneAndUpdate(
        { chatId },
        { $inc: { token:  0.001} },
        { new: true }
        );
    }
    res.status(200).json({ message: "Points updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update points", error });
  }
});

export type filterBlockObject={
  $field : string,
  $op : string,
  $value : any
}

app.post("/getTransactionInfo", async (req, res) => {
  const { hash,chatId } = req.body;
  try {
    const transaction = await getTransactionInfo(hash);
    if(!transaction) return res.status(200).send({message:"Transaction not found. Please try Again",data: null});
    txnObj[chatId] = transaction;
    const txnSummary = await transactionDetails(hash,[],JSON.stringify(transaction));
    console.log(txnSummary)
    res.status(200).send({ message:"Transaction Found",data: {detail:transaction,explanation:txnSummary}});
  } catch (error) { 
    res.status(500).json({ message: "Failed to fetch transaction. Please Try Again", data:null });
  }
});

app.post("/getTransactionMessages", async (req, res) => {
  const { message, history, chatId } = req.body;
  const hash = ""
  try {


    const transaction = await transactionDetails(message,history,JSON.stringify(txnObj[chatId]));
    res.status(200).send({ message:"Transaction Found",data: transaction});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transaction. Please Try Again", data:null });
  }
});

app.post("/getNeox",async(req,res)=>{
  const { message, history } = req.body;
  try {
    const neox = await neoXRag(message,history);
    res.status(200).send({ message:"NeoX Found",data: neox});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch NeoX. Please Try Again", data:null });
  }
})

app.post("/fillWallet",async(req,res)=>{
  const { walletAddress } = req.body;
  try {
    const transaction = await getTransactions("0x8697477f54897ACADD7673B7c325ac31bd7F080d");
    res.status(200).send({ message:"Transaction Found",data: "Wallet Has been synced with RPC. You can now query the wallet"});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transaction. Please Try Again", data:null });
  }
});

app.post("/queryWallet",async(req,res)=>{
  const { message } = req.body;
  try {
    const query:any = await finalChain(message,[]);
    console.log(query)
    const jsonObj = extractAndParseJSON(query);
    console.log(jsonObj)
    if(jsonObj){
      const query = queryFilter(jsonObj);
      try {
        let qStr = JSON.stringify(query);
        console.log(qStr)
        const transactions = await Transaction.find(query);
        return res.status(200).send({ message:"Transactions Found",data: transactions});
      } catch (error:any) {
        throw new Error(error);
      }
    }
    else {
      return res.status(200).send({ message:"Error Parsing the Message please try again",data: null});
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch transactions. Please Try Again", data:null });
  }
})

function extractAndParseJSON(responseString:string) {
  // Regular expression to capture content between ```json and ```
  const regex = /```json([\s\S]*?)```/;
  
  // Extract the JSON string
  const match = responseString.match(regex);
  console.log(match)
  if (match && match[1]) {
    try {
      // Parse the JSON string
      const parsedData = JSON.parse(match[1].trim());
      return parsedData;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
  
  console.error('No valid JSON block found in the response.');
  return null;
}

server.listen(8000, async () => {
  console.log("Server is running on port 8000");
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");
    startWebSocketServer(server);
    bot.start();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});


// transferAmount("0x28007dE685867d90551d3c73F2e2BeF0cb037a9E","0.0001")

// neoXRag("how to set up neoX",[])


// getTransactions("0x8697477f54897ACADD7673B7c325ac31bd7F080d")



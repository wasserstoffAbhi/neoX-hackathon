import { Bot, InlineKeyboard, InputFile } from "grammy";
import User from "../models/userSchema";
import { createWallet, getBalanceInTokens } from "../wallet";
import axios from "axios";
import fs from "fs";


let userStates:any = {};


const bot = new Bot(process.env.BOT_TOKEN || "");
bot.command("start", async (ctx) => {
  console.log("NEodkdsnkldsnkdsnlidsnflkdsnfklndslkfndslkfndsk")
  const chatId = ctx.chat.id;
  const username = ctx.chat.username;
  let user = await User.findOne({ chatId: chatId });
  
  if (!user) {
    let wallet = createWallet(chatId);

    user = new User({ chatId, username, points: 0,walletAddress:wallet.address, privateKey:wallet.privateKey, token:0 });
    await user.save();
  } else {
    const balance:any = await getBalanceInTokens(user.walletAddress);
    user.token = balance;
    await user.save();
  }
  replyOnStartRefresh(user,ctx);
});

const replyOnStartRefresh = (user:any,ctx:any)=>{
  try {
    const chatId = ctx.chat.id;
    let walletAddress = user.walletAddress;
    let balance =  user.token;

    const message = `
      *Welcome to NeoX Bot!*\n The One Stop Solution for all your Neo needs.\n\nHere You can play games, query your wallet, transactions and NeoX Information.\n\nYou can Try out the following commands:\n

      Here are your wallet details:\n
      👛 Wallet Address :\`${walletAddress}\`(Tap To Copy)\n\n

      💰 Balance : ${balance} GAS\n

      Use the buttons below to:
      🎮 Play the Game
      💼 Query your Wallet
      🔍 Query Transactions
      ℹ️ Query Neo Information
    `;

    const keyboard = 
      new InlineKeyboard([
        [
          InlineKeyboard.url( "🎮 Tap & Earn", `https://hackathon-nine-eta.vercel.app/${chatId}` ),
        ],
        [
          InlineKeyboard.url( "🎮 View My Avatars", `https://hackathon-nine-eta.vercel.app/${chatId}/avatar` ),
        ],
        [
          InlineKeyboard.url( "💼 Query Wallet", `https://hackathon-nine-eta.vercel.app//${chatId}/avatar` ),
        ],
        [
          InlineKeyboard.url( "🔍 Query Transactions", `https://hackathon-nine-eta.vercel.app/${chatId}/` ),
          
        ],
        [
          InlineKeyboard.url( " ℹ️ Query Neo Information", `https://hackathon-nine-eta.vercel.app/` ),

        ],
        [
          {text:"Generate Avatar",callback_data:"generate_avatar"},
        ],
        [
          {text:"Deposit",callback_data:"deposit"},
          {text:"Withdraw",callback_data:"withdraw"}
        ],
        [
          {text:"Refresh",callback_data:"refresh_balance"},
        ]
      ]);
    
    ctx.reply(message, {
      parse_mode:"Markdown",
      reply_markup: keyboard,
    });
  } catch (error) {
    ctx.reply("An error occurred. Please try again.");
  }
}

const generateAvatar =  async(ctx:any) => {
  try {
    const userId = ctx.from.id;
    userStates[userId] = "awaiting_prompt"; // Set user state
    await ctx.answerCallbackQuery(); // Respond to the callback
    ctx.reply("Currently We Have Trained on One Avatar *Rubicorn*. \n Please enter your prompt:",{
      parse_mode:"Markdown"
    });
    
  } catch (error) {
    

  }
}

bot.on("callback_query:data", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData == "generate_avatar") {
    await generateAvatar(ctx);
  } else if (callbackData == "refresh_balance") {
    await refreshBalance(ctx);
  }
});


const refreshBalance = async (ctx:any) => {
  const chatId = ctx.chat.id;
  let user = await User.findOne({ chatId: chatId });
  if (!user) {
    return ctx.reply("User not found");
  }
  replyOnStartRefresh(user,ctx);
}

// Listen for user messages (prompts)
bot.on("message:text", async(ctx) => {
  try {
    
    const userId = ctx.from.id;
    if (userStates[userId] === "awaiting_prompt") {
        const prompt = `rubicon a small bunny robot ${ctx.message.text}`;
  
        // Process the prompt (you can replace this with your logic)
        const response = await axios.post("https://b765-2401-4900-8841-cb02-7403-b007-b950-1962.ngrok-free.app/generate", { prompt });
        console.log(typeof response.data,response.data,",,,,,,,,,,,,,,,,,,,")
        // Reset the user's state
        userStates[userId] = null;
        // const binaryData = response.data;
        // let buffer:any = Buffer.from(binaryData, "binary");
        const base64String = response.data?.response; // Assuming this contains the Base64 string
        const buffer = Buffer.from(base64String, 'base64'); // Decode to binary

        // Wrap the buffer as an InputFile and send it
        const file = new InputFile(buffer, "generated-image.png"); // You can set the filename
        await ctx.replyWithPhoto(file, { caption: "Here is your generated image!" });
  
        // Send the file to the user
        // await ctx.replyWithPhoto(fileStream);
    } else {
        ctx.reply("Please click the button to start sending a prompt.");
    }
  } catch (error) {
    console.log(error);
    ctx.reply("An error occurred. Please try again.");
  }

  // Check if the user is in the awaiting_prompt state
});


export default bot;
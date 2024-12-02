import { Bot, InlineKeyboard } from "grammy";
import User from "../models/userSchema";
import { createWallet } from "../wallet";
import axios from "axios";


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
  } 
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
        InlineKeyboard.url( "🎮 Tap & Earn", "https://google.com" ),
      ],
      [
        InlineKeyboard.url( "💼 Query Wallet", "https://google.com" ),
      ],
      [
        InlineKeyboard.url( "🔍 Query Transactions", "https://google.com" ),
        
      ],
      [
        InlineKeyboard.url( " ℹ️ Query Neo Information", "https://google.com" ),

      ],
      [
        {text:"Generate Avatar",callback_data:"generate_avatar"},
      ],
      [
        {text:"Deposit",callback_data:"deposit"},
        {text:"Withdraw",callback_data:"withdraw"}
      ]
    ]);
  
  ctx.reply(message, {
    parse_mode:"Markdown",
    reply_markup: keyboard,
  });
});

bot.callbackQuery("generate_avatar", async (ctx) => {
  const userId = ctx.from.id;
  userStates[userId] = "awaiting_prompt"; // Set user state
  await ctx.answerCallbackQuery(); // Respond to the callback
  ctx.reply("Currently We Have Trained on One Avatar *Rubicorn*. \n Please enter your prompt:",{
    parse_mode:"Markdown"
  });
});

// Listen for user messages (prompts)
bot.on("message:text", async(ctx) => {
  const userId = ctx.from.id;

  // Check if the user is in the awaiting_prompt state
  if (userStates[userId] === "awaiting_prompt") {
      const prompt = ctx.message.text;

      // Process the prompt (you can replace this with your logic)
      const response = await axios.post("https://2dbb-2401-4900-8841-cae1-eaf5-689c-1402-a8/generate", { prompt });
      console.log(response)
      // Reset the user's state
      userStates[userId] = null;


      // Send the file to the user
      await ctx.replyWithPhoto(response.data);
  } else {
      ctx.reply("Please click the button to start sending a prompt.");
  }
});


export default bot;
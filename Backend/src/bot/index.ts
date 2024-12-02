import { Bot, InlineKeyboard } from "grammy";
import User from "../models/userSchema";
import { createWallet } from "../wallet";


let obj:any = {

}


const bot = new Bot(process.env.BOT_TOKEN || "");
bot.command("start", async (ctx) => {
  const chatId = ctx.chat.id;
  const username = ctx.chat.username;
  const chat = await bot.api.getChat(chatId);
  let user = await User.findOne({ chatId: chatId });
  console.log(user)
  
  if (!user) {
    let wallet = createWallet(chatId);

    user = new User({ chatId, username, points: 0,walletAddress:wallet.address, privateKey:wallet.privateKey, token:0 });
    await user.save();

    ctx.reply("Welcome! You are now registered.");
  } else {
    ctx.reply(
      `Welcome back, ${username || "user"}! You have ${user.points} points ${user.walletAddress}.`
    );
  }
  let walletAddress = user.walletAddress;
  let balance =  user.token;
  const message = `
    *Welcome to NeoX Bot!*\n The One Stop Solution for all your Neo needs.\n\nHere You can play games, query your wallet, transactions and NeoX Information.\n\nYou can Try out the following commands:\n

    Here are your wallet details:\n
    👛 Wallet Address :\`${walletAddress}\`(Tap To Copy)\n\n

    💰 Balance : ${balance}\n

    Use the buttons below to:
    🎮 Play the Game
    💼 Query your Wallet
    🔍 Query Transactions
    ℹ️ Query Neo Information
  `;

  const keyboard = 
    new InlineKeyboard([
      [
        {text:"copy wallet address",callback_data:"copy_wallet_address"},
      ],
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
        {text:"Deposit",callback_data:"deposit"},
        {text:"Withdraw",callback_data:"withdraw"}
      ]
    ]);
  
  ctx.reply(message, {
    parse_mode:"Markdown",
    reply_markup: keyboard,
  });
});

// Reply to any text message
// bot.on("message:text", async(ctx) => {
//   if(!obj.hasOwnProperty(ctx.chatId)) obj[ctx.chatId] = [];
//   // Only store the recent 2 messages
//   if(obj[ctx.chatId].length >= 2) obj[ctx.chatId].shift();
//   obj[ctx.chatId].push(ctx.message.text);
//   console.log(obj)

//   // write a regex code to match the 32 biit hex string or 64 bit hex string and console it's type and it should start with 0x
//   const regex64 = /0x[a-fA-F0-9]{64}/;
//   const regex32 = /0x[a-fA-F0-9]{32}/;
//   if(regex64.test(ctx.message.text)){
//     ctx.reply("It's a 64 bit hex string")
//   } else if(regex32.test(ctx.message.text)){
//     ctx.reply("It's a 32 bit hex string")
//   } else {
//     ctx.reply("It's a 32 bit hex string")
//   }

// });


export default bot;
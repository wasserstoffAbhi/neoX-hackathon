import { Bot, InlineKeyboard } from "grammy";
import User from "../models/userSchema";


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
    
    user = new User({ chatId, username, points: 0 });
    await user.save();

    ctx.reply("Welcome! You are now registered.");
  } else {
    ctx.reply(
      `Welcome back, ${username || "user"}! You have ${user.points} points ${user.walletAddress}.`
    );
  }
  
  const keyboard = new InlineKeyboard().url(
    "🎮 Play Game",
    "https://hackathon-nine-eta.vercel.app/837414318" 
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


export default bot;
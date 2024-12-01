import Avatar from "../models/avatars";
import User from "../models/userSchema";

// const userSchema: Schema = new Schema({
//   chatId: {
//     type: Number,
//     required: true,
//     unique: true
//   },
//   username: {
//     type: String,
//   },
//   points: {
//     type: Number,
//     default: 0
//   },
//   token:{
//     type: Number,
//     default : 0
//   },
//   activeAvatarId:{
//     type: Schema.Types.ObjectId,
//     ref: 'Avatar'
//   },
//     // Add the avatar field to the User schema with id and count fields and reference the Avatar model and It should be array of objects and default value should be empty array and the id must be unique
//   avatar:[
//     {
//       id:{
//         type: Schema.Types.ObjectId,
//         ref: 'Avatar',
//         unique: true
//       },
//       count:{
//         type: Number,
//         default: 1
//       }
//     }
//   ],
//   unlocked: [
//     {
//       id:{
//         type: Schema.Types.ObjectId,
//         ref: 'Avatar',
//         unique: true
//       },
//       count:{
//         type: Number,
//         default: 1
//       }
//     }
//   ]

// });

// const avatarSchema: Schema = new Schema({
//   url: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   rank: {
//     type: Number,
//     required: true
//   },
//   price:{
//     type: Number,
//     default: 0
//   },
//   rankType:{
//     type: String,
//     default: "common"
//   }
// });

export class DbService {

  static getUser = async (chatId: number) => {

    try {
      // Fetch user based on chatId and return userName and points and activeAvatar url
      return await User.findOne({ chatId }).populate("activeAvatarId");
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  static getAvatars = async (chatId: number) => {
    try {
      // Fetch all avatars sorted by rank and return only rank
      const avatars = await Avatar.find().sort({ rank: 1 });
      let avatarMap:any = {};
      let avatarRank:any = {};
      for(const avatar of avatars){
        avatarMap[avatar["id"]] = avatar;
        avatarRank[avatar["id"]] = avatar["rankType"];
      }
      // ava will be array of obj Value
      let ava = avatarRank;
      // Fetch user based on chatId
      const user = await User.findOne({ chatId }).populate("avatar");
      console.log(user);
      if (!user) {
        throw new Error("User not found");
      }

      // Map user's avatar ownership details with the avatar schema if user?.owned is true price is 50% of the original price
      let userAvatarsOwned:any = [];
    
      for(const avatar of user.avatar){
        let avatarId = avatar.id.toString();
        userAvatarsOwned.push({
          id: avatar.id,
          count: avatar.count,
          price: Math.floor(avatarMap[avatarId]["price"] / 2),
          rank: avatarMap[avatarId]["rank"],
          url: avatarMap[avatarId]["url"]
        });
      }
      let userAvatarsUnlocked:any = [];
      for(const unlocked of user.unlocked){
        let unlockedId = unlocked.id.toString();
        userAvatarsUnlocked.push({
          id: unlocked.id,
          count: unlocked.count,
          price: avatarMap[unlockedId]["price"],
          rank: avatarMap[unlockedId]["rank"],
          url: avatarMap[unlockedId]["url"]
        });
      }
      return {userAvatarsOwned,avatars:ava,userAvatarsUnlocked};
    } catch (error) {
      console.error("Error fetching avatars:", error);
      throw new Error("Failed to fetch avatars");
    }
  };

  static fetchAvatarByRank = async (rank: string,chatId:number) => {
    try {
      // Fetch avatar based on rank
      const user = await User.findOne({ chatId });
      if (!user) {
        throw new Error("User not found");
      }
      const avatars = await Avatar.find({ rankType: rank });
      console.log(avatars);
      const avatar = avatars[Math.floor(Math.random() * avatars.length)];
      console.log(avatar);
      const unlockedAvatar = user.unlocked;
      // Check if user already has The unlocked avatar in his unlocked list
      const unlocked = unlockedAvatar.find(
        (ua:any) => ua.id.toString() === avatar["id"]
      );

      // if user already has the avatar, increment the count
      if (unlocked) {
        unlocked.count += 1;
      }
      // if user doesn't have the avatar, add the avatar to the user's unlocked list
      else {
        unlockedAvatar.push({ id: avatar["id"], count: 1 });
      }
      user.unlocked = unlockedAvatar;
      await user.save();

      return avatar;
    } catch (error) {
      console.log("Error fetching avatar by rank:", error);
      throw new Error("Failed to fetch avatar by rank");
    }
  }

  static assignAvatarToUser = async (chatId: number, avatarId: any) => {
    try {
      // Fetch user based on chatId
      const user = await User.findOne({ chatId });

      if (!user) {
        throw new Error("User not found");
      }
      // check Avatar exist in the unlocked user Avatars schema
      const unlockedAvatar = user.unlocked.find(
        (ua:any) => ua.id.toString() === avatarId
      );
      if (!unlockedAvatar) {
        throw new Error("User doesn't Have this avatar in watchlist");
      }

      // now Remove the avatar from the unlocked list
      let newUnlocked = user.unlocked.filter(
        (ua:any) => ua.id.toString() !== avatarId
      );
      user.unlocked = newUnlocked.length > 0 ? newUnlocked : [];
      // Check if user already owns the avatar
      const userAvatar = user.avatar.find(
        (ua:any) => ua.id.toString() === avatarId
      );

      // if user already owns the avatar, increment the count
      if (userAvatar) {
        userAvatar.count += 1;
      } else {
        // if user doesn't own the avatar, add the avatar to the user's avatar list
        user.avatar.push({ id: avatarId, count: 1});
      }
      await   user.save();
    } catch (error) {
      console.error("Error assigning avatar to user:", error);
      throw new Error("Failed to assign avatar to user");
    }
  }

  static setActiveAvatar = async (chatId: number, avatarId: any) => {
    try {
      // Fetch user based on chatId only if he owns the avatar
      const user = await User.findOne({ chatId });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user owns the avatar
      const userAvatar = user.avatar.find(
        (ua:any) => ua.id.toString() === avatarId
      );

      if (!userAvatar) {
        throw new Error("User doesn't own the avatar");
      }

      // Set the activeAvatarId to the avatarId
      user.activeAvatarId = avatarId;
      await user.save();
    } catch (error) {
      console.error("Error setting active avatar:", error);
      throw new Error("Failed to set active avatar");
    }
  }
  
}
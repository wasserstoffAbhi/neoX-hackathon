// define Avatar schema with fields <url> <rank> 

import mongoose, { Schema, Document } from 'mongoose';

// Define the Avatar schema
interface IAvatar extends Document {
    url: string;
    rank: number;
    rankType:string;
    price: number;
}

const avatarSchema: Schema = new Schema({
  url: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true
  },
  price:{
    type: Number,
    default: 0
  },
  rankType:{
    type: String,
    default: "common"
  }
});

// Create the Avatar model from the schema
const Avatar = mongoose.model<IAvatar>('Avatar', avatarSchema);

export default Avatar;
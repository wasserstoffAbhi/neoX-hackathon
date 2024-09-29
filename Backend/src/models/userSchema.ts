import mongoose, { Schema, Document } from 'mongoose';

// Define the User schema
interface IUser extends Document {
    chatId: number;
    username?: string;
    points: number;
}

const userSchema: Schema = new Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
    },
    points: {
        type: Number,
        default: 0
    },
    token:{
        type: Number,
        default : 0
    }
});

// Create the User model from the schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;

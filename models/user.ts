import mongoose from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isAi: boolean;
  aiName: string;
  name: string;
  salt?: string;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'email jest wymagany'] },
  password: { type: String, required: [true, 'hasło jest wymagane'] },
  isAi: { type: Boolean, default: 0 },
  name: { type: String, required: true },
  aiName: { type: String, required: true },
  salt: String,
});

export const UserModel = mongoose.model<IUser>('User', userSchema);

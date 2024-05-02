import mongoose from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  isAi: boolean;
  salt?: string;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'email jest wymagany'] },
  password: { type: String, required: [true, 'hasło jest wymagane'] },
  isAi: { type: Boolean, default: 0 },
  salt: String,
});

export const UserModel = mongoose.model<IUser>('User', userSchema);

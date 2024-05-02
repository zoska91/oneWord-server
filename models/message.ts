import mongoose from 'mongoose';

export interface IMessage extends Document {
  content: string;
  role: 'user' | 'system' | 'assistant';
  conversationId: string;
}

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  password: { type: String, required: true },
  conversationId: { type: String, required: true },
});

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

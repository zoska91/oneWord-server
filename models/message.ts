import mongoose from 'mongoose';

export interface IMessage extends Document {
  human: string;
  ai: string;
  conversationId: string;
  created_at: Date;
}

const messageSchema = new mongoose.Schema({
  human: { type: String, required: true },
  ai: { type: String, required: true },
  conversationId: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

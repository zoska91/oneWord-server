import mongoose from 'mongoose';

export interface IMistake {
  id: string;
  mistake: string;
  correction: string;
}
export interface INewWord {
  id: string;
  word: string;
}

export interface IMessage extends Document {
  human: string;
  ai: string;
  conversationId: string;
  created_at: Date;
  mistakes: IMistake[];
  newWords: INewWord[];
  userId: string;
}

const messageSchema = new mongoose.Schema({
  human: { type: String, required: true },
  ai: { type: String, required: true },
  conversationId: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  mistakes: { type: Array },
  words: { type: Array },
  userId: { type: String, required: true },
});

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

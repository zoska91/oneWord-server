import mongoose from 'mongoose';

export interface IMemories extends Document {
  created_at: Date;
  description: string;
  conversationId: string;
}

const memoriesSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  description: { type: String, required: true },
  conversationId: { type: String, required: true },
});

export const MemoriesModel = mongoose.model<IMemories>(
  'Memories',
  memoriesSchema
);

import mongoose from 'mongoose';

export interface IMemories extends Document {
  created_at: Date;
  description: string;
  conversationId: string;
  qdrantId: string;
  userId: string;
}

const memoriesSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  description: { type: String, required: true },
  conversationId: { type: String, required: true },
  qdrantId: { type: String, required: true },
  userId: { type: String, required: true },
});

export const MemoriesModel = mongoose.model<IMemories>(
  'Memories',
  memoriesSchema
);

import mongoose, { Document } from 'mongoose';

export interface ICron extends Document {
  userId: string;
  cronId: string;
  createdDate: string;
}

const cronSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdDate: { type: Date, default: new Date() },
  cronId: { type: String, requires: true },
});

export const CronModel = mongoose.model<ICron>('Cron', cronSchema);

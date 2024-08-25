import mongoose, { Document, Types } from 'mongoose';

export interface IResult extends Document {
  userId: string;
  createdDate: Date;
  _id: Types.ObjectId;
  correctAnswers: number;
  badAnswers: number;
}

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdDate: { type: Date, default: new Date() },
  correctAnswers: { type: Number, default: 0 },
  badAnswers: { type: Number, default: 0 },
});

export const ResultModel = mongoose.model<IResult>('Result', resultSchema);

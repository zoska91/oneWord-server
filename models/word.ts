import mongoose, { Document, Types } from 'mongoose';

export interface IWord extends Document {
  userId: Types.ObjectId;
  basicWord: string;
  transWord: string;
  addLang: number;
  status: number;
  createdDate: Date;
  updatedDate: Date;
  _id: Types.ObjectId;
}

const wordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  basicWord: { type: String, required: [true, 'to pole jest wymagane'] },
  transWord: { type: String, required: [true, 'to pole jest wymagane'] },
  addLang: { type: Number, default: 7 },
  status: { type: Number, default: 0 },
  createdDate: { type: Date, default: new Date() },
  updatedDate: { type: Date, default: new Date() },
});

export const WordModel = mongoose.model<IWord>('Word', wordSchema);

//status
// 0 - new (to learn)
// 1 - today
// 2 - done

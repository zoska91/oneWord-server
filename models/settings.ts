import mongoose, { Types } from 'mongoose';
import { AvailableLanguages } from '../enums/languages';

export interface INotification extends Document {
  time: string;
  type: string;
}

export interface ISettings extends Document {
  userId: Types.ObjectId;
  breakDay: number;
  isBreak: boolean;
  isSummary: boolean;
  notifications: INotification[];
  languageToLearn: number;
  summaryDay: number;
  baseLanguage: number;
}

const NotificationSchema = new mongoose.Schema({
  time: String,
  type: String,
});

const SettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  breakDay: { type: Number, default: 7 },
  isBreak: { type: Boolean, default: true },
  isSummary: { type: Boolean, default: true },
  notifications: {
    type: [NotificationSchema],
    default: [
      { time: '12:42', type: '1' },
      { time: '14:42', type: '2' },
      { time: '16:42', type: '3' },
    ],
  },
  languageToLearn: { type: Number, default: AvailableLanguages.en },
  baseLanguage: { type: Number, default: AvailableLanguages.pl },
  summaryDay: { type: Number, default: 1 },
});

export const SettingsModel = mongoose.model<ISettings>(
  'Settings',
  SettingsSchema
);
export const NotificationModel = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);

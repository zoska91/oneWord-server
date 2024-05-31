import mongoose, { Types } from 'mongoose';

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdDate: string;
}

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
  createdDate: { type: Date, default: new Date() },
});

export const SubscriptionModel = mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema
);

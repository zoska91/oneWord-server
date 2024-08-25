import mongoose from 'mongoose';
import { CronModel } from '../../models/cron';
import { MemoriesModel } from '../../models/memories';
import { MessageModel } from '../../models/message';
import { SettingsModel } from '../../models/settings';
import { SubscriptionModel } from '../../models/subscription';
import { UserModel } from '../../models/user';
import { WordModel } from '../../models/word';
import { ResultModel } from '../../models/result';

export enum ModelName {
  CronModel = 'CronModel',
  MemoriesModel = 'MemoriesModel',
  MessageModel = 'MessageModel',
  SettingsModel = 'SettingsModel',
  SubscriptionModel = 'SubscriptionModel',
  UserModel = 'UserModel',
  WordModel = 'WordModel',
  ResultModel = 'ResultModel',
}

const modelsMap: Record<ModelName, mongoose.Model<any>> = {
  CronModel,
  MemoriesModel,
  MessageModel,
  SettingsModel,
  SubscriptionModel,
  UserModel,
  WordModel,
  ResultModel,
};

export const cleanAll = async (collectionNames: ModelName[]): Promise<void> => {
  try {
    await Promise.all(
      collectionNames.map(async (modelName) => {
        const Model = modelsMap[modelName];
        if (!Model) {
          return;
        }
        await Model.deleteMany({});
      })
    );
    console.log('All collections cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning collections:', error);
    throw error;
  }
};

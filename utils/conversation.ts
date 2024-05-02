import { saveLog } from '../logger';
import { MessageModel } from '../models/message';

export const getConversation = async (conversationId: string) => {
  try {
    const conversation = await MessageModel.find({ conversationId }).lean();

    const messages = conversation.map((message) => {
      return {
        content: message.content,
        role: message.role,
      };
    });

    return messages;
  } catch (e) {
    saveLog('error', 'POST', 'getConversation', '', e);
    return 401;
  }
};

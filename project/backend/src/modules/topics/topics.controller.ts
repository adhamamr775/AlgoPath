import { Request, Response, NextFunction } from 'express';
import { TopicsService } from './topics.service';
import { sendSuccess } from '../../utils/response.utils';

const topicsService = new TopicsService();

// THIS is what we are exporting to the router
export const getTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicName } = req.params;
    // Safely extract the ID depending on how your JWT middleware structures it
    const userId = req.user?.user_id;

    const data = await topicsService.getTopicData(topicName as string, userId ?? null);
    sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};
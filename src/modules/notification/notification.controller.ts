import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as notificationService from './notification.service';
import pick from '../utils/pick';

export const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationService.getAllNotifications();

    res.status(200).send(result);
});

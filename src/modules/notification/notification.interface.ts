import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface INotification {
  message: string;
  status: string;
  userId: string;
}


export interface INotificationDoc extends INotification, Document {
}

export interface INotificationModel extends Model<INotificationDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

import { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IUser {
  email: string;
  name: string;
}

export interface ITask {
  title: string;
  description?: string;
  status: 'assigned' | 'active' | 'completed' | 'cancelled';
  assignee?: string | IUser; // Support both ObjectId and populated User
  projectId: string; 
}

export interface ITaskDoc extends ITask, Document {}

export interface ITaskModel extends Model<ITaskDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

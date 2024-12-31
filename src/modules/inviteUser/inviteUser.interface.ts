import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IInviteUser {
  email: string;
  role: string;
  status: 'pending' | 'approved';
}

export interface IInviteUserDoc extends IInviteUser, Document {}

export interface IInviteUserModel extends Model<IInviteUserDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

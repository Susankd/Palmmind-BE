import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IProject {
  name: string;
  description: string;
  creator: string; // Assuming creator is the ID of the User model
  teamMembers: string[]; // Assuming team members are IDs of the User model
}


export interface IProjectDoc extends IProject, Document {
}

export interface IProjectModel extends Model<IProjectDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

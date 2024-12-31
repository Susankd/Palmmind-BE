import mongoose from 'mongoose';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';
import { ITaskDoc, ITaskModel } from './task.interface';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['assigned', 'active', 'completed', 'cancelled'],
      required: true,
      default: "assigned"
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

const Task = mongoose.model<ITaskDoc, ITaskModel>('Task', taskSchema);

export default Task;

import mongoose from 'mongoose';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';
import { IProjectDoc, IProjectModel } from '../paginate/paginate.types';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

const Project = mongoose.model<IProjectDoc, IProjectModel>('Project', projectSchema);

export default Project;
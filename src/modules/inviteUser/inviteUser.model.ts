import mongoose from 'mongoose';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';
import { roles } from '@/config/roles';

// Define the InviteUser schema
const inviteUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Invalid email format',
      },
    },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      required: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Apply plugins
inviteUserSchema.plugin(toJSON);
inviteUserSchema.plugin(paginate);

const InviteUser = mongoose.model('InviteUser', inviteUserSchema);

export default InviteUser;

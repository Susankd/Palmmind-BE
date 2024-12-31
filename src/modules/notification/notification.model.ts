import mongoose from 'mongoose';
import { toJSON } from '../toJSON';
import { paginate } from '../paginate';
import { INotificationDoc, INotificationModel } from './notification.interface';

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model<INotificationDoc, INotificationModel>('Notification', notificationSchema);

export default Notification;
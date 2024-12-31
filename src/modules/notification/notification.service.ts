import Notification from './notification.model';
import { IOptions, QueryResult } from '../paginate/paginate';

/**
 * Fetch all notifications for a specific user.
 * @param filter - Filters to apply for fetching notifications (e.g., userId).
 * @param options - Pagination and sorting options.
 * @returns A paginated list of notifications.
 */
export const getAllNotifications = async (
 
): Promise<any> => {
  const notifications = await Notification.find({});

  return notifications;
};

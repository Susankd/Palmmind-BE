import httpStatus from 'http-status';
import { ApiError } from '../errors';
import Task from './task.model';
import { ITask } from './task.interface';
import { IOptions, QueryResult } from '../paginate/paginate';
import { transporter } from '../inviteUser/inviteUser.service';
import config from '../../config/config'; // Config file for SMTP or environment variables
import { User } from '../user';
// import { io } from '../../app'; 

import Notification from '../notification/notification.model';
import { io } from '../utils/socket.service';

export const createTask = async (taskData: ITask) => {
  // Create the task
  const task = await Task.create(taskData);

  // Get the assignee details
  const assignee = await Task.populate(task, {
    path: 'assignee',
    select: 'email name',
  });

  if (!assignee || !assignee.assignee?.email) {
    throw new Error('Assignee email not found');
  }

  // Send an email to the assignee
  await transporter.sendMail({
    from: config.email.from,
    to: assignee.assignee.email,
    subject: `You have been assigned a new task: ${task.title}`,
    html: `
      <p>Dear ${assignee.assignee.name},</p>
      <p>You have been assigned a new task: <strong>${task.title}</strong>.</p>
      <p>Please check the application for further details.</p>
    `,
  });

  return task;
};

export const getAllTasks = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const { assignee, ...otherFilters } = filter;

  if (assignee) {
    // Look up all user IDs by partial and case-insensitive name match
    const users = await User.find({ name: new RegExp(assignee, 'i') });
    const userIds = users.map(user => user._id); 

    if (userIds.length > 0) {
      otherFilters.assignee = { $in: userIds }; 
    } else {
      return {
        results: [],
        totalPages: 0,
        totalResults: 0,
        page: options.page || 1,
        limit: options.limit || 10,
      };
    }
  }

  const tasks = await Task.paginate(otherFilters, options);

  const populatedTasks = await Task.populate(tasks.results, [
    {
      path: 'assignee',
      select: 'name',
    },
    {
      path: 'projectId',
      select: 'name',
    },
  ]);

  // Return the updated tasks with populated fields
  return {
    ...tasks,
    results: populatedTasks,
  };
};

export const getTaskById = async (taskId: string) => {
  const task = await Task.findById(taskId).populate('assignee').populate('projectId');
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return task;
};

export const updateTask = async (taskId: string, taskData: Partial<ITask>, userId: string) => {
  const existingTask = await Task.findById(taskId);
  if (!existingTask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const isStatusChanged = taskData.status && taskData.status !== existingTask.status;

  const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });

  if (isStatusChanged) {
    const notification = await Notification.create({
      userId,
      message: `Task "${updatedTask.title}" status updated to "${updatedTask.status}".`,
    });

    // Emit the status change notification using Socket.IO
    io.emit('task-status-updated', {
      status: 'unread',
      notificationId: notification._id,
      message: notification.message,
    });
  }

  return updatedTask;
};

export const deleteTask = async (taskId: string) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
};

export const getTaskByProjectId = async (projectId: string) => {
  const task = await Task.find({projectId}).populate('assignee').populate('projectId');
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return task;
};
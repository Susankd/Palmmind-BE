import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as taskService from './task.service';
import pick from '../utils/pick';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

export const getAllTasks = catchAsync(async (_req: Request, res: Response) => {
  const filter = pick(_req.query, ['name', 'status', 'assignee']);
  const options = pick(_req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.getAllTasks(filter, options);
  res.send(result);
});

export const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  const task = await taskService.getTaskById(taskId);
  res.status(200).json({ message: 'Task fetched successfully', data: task });
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  const updatedTask = await taskService.updateTask(taskId, req.body, req.user?.id);
  res.status(200).send(updatedTask);
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  await taskService.deleteTask(taskId);
  res.status(200).json({ message: 'Task deleted successfully' });
});


export const getTaskByProjectId = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const task = await taskService.getTaskByProjectId(projectId);
  res.status(200).json({ message: 'Task fetched successfully', data: task });
});
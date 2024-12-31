import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as projectService from './project.service';
import pick from '../utils/pick';

const createProject = catchAsync(async (req: Request, res: Response) => {
  const creatorId = req.user?.id;
  const projectData = { ...req.body, creator: creatorId };
  const project = await projectService.createProject(projectData);
  res.status(httpStatus.CREATED).send(project);
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  await projectService.deleteProject(projectId);
  res.status(200).json({ message: 'Project deleted successfully' });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const updatedProject = await projectService.updateProject(projectId, req.body);
  res.status(httpStatus.OK).send(updatedProject);
});

const getAllProjects = catchAsync(async (_req: Request, res: Response) => {
  const filter = pick(_req.query, ['name', 'status']);
  const options = pick(_req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.getAllProjects(filter, options);
  res.send(result);
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = await projectService.getProjectById(projectId);
  res.status(200).json({ message: 'Project fetched successfully', data: project });
});

export { createProject, deleteProject, updateProject, getAllProjects, getProjectById };

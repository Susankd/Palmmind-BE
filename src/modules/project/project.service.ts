import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { IProject } from './project.interface';
import Project from './project.model';
import { IOptions, QueryResult } from '../paginate/paginate';

export const getAllProjects = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  
  const projects = await Project.paginate(filter, options);

  // Populate `teamMembers` field with their `name`
  const populatedProjects = await Project.populate(projects.results, {
    path: 'teamMembers',
    select: 'name', // Fetch only the `name` field for team members
  });

  // Return the updated projects with populated team members
  return {
    ...projects,
    results: populatedProjects,
  };
};

export const getProjectById = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  return project;
};

export const createProject = async (projectData: IProject): Promise<IProject> => {
  const result = await Project.create(projectData);
  
  return result;
};

export const deleteProject = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  await Project.findByIdAndDelete(projectId);
};

export const updateProject = async (
  projectId: string,
  projectData: Partial<IProject>
): Promise<IProject | null> => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const updatedProject = await Project.findByIdAndUpdate(projectId, projectData, { new: true });
  return updatedProject;
};

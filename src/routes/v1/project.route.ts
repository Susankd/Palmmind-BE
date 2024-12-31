import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { projectController } from '../../modules/project';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('user'), projectController.createProject)
  .get(projectController.getAllProjects);

router
  .route('/:projectId')
  .get(auth('user'), projectController.getProjectById)
  .patch(auth('user'), projectController.updateProject)
  .delete(auth('superadmin'), projectController.deleteProject);

export default router;

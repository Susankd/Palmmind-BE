import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { taskController } from '../../modules/task';

const router: Router = express.Router();

router
    .route('/')
    .post(auth('user'), taskController.createTask)
    .get(auth('user'), taskController.getAllTasks);

router
    .route('/:id')
    .get(auth('user'), taskController.getTaskById)
    .patch(auth('user'), taskController.updateTask)
    .delete(auth('superadmin'), taskController.deleteTask);

router
    .route('/project/:projectId')
    .get(taskController.getTaskByProjectId)

export default router;

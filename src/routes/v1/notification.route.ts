import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { notificationController } from '../../modules/notification';

const router: Router = express.Router();

router
  .route('/')
  .get(auth('user'), notificationController.getAllNotifications);

export default router;

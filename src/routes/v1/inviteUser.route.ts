import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { inviteUserController } from '../../modules/inviteUser';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('superadmin'), inviteUserController.inviteUser);

router
  .route('/approve')
  .post(inviteUserController.approveInvitation);

export default router;

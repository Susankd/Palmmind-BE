import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { userController, userValidation } from '../../modules/user';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('superadmin'), validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('user'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('superadmin'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('superadmin'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
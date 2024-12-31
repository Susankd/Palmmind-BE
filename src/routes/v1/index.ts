import express, { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import config from '../../config/config';
import project from './project.route';
import task from './task.route';
import inviteUser from './inviteUser.route';
import notification from './notification.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/project',
    route: project,
  },
  {
    path: '/task',
    route: task,
  },
  {
    path: '/inviteUser',
    route: inviteUser,
  },
  {
    path: '/notification',
    route: notification,
  },
 
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;

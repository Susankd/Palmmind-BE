import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as inviteUserService from './inviteUser.service';

// Controller to invite a user
export const inviteUser = catchAsync(async (req: Request, res: Response) => {
  const { email, role } = req.body;

  const invite = await inviteUserService.inviteUser(email, role);
  res.status(httpStatus.CREATED).json({
    message: `Invitation sent to ${email} successfully`,
    data: invite,
  });
});

// Controller to approve an invitation
export const approveInvitation = catchAsync(async (req: Request, res: Response) => {
  const { email, role, name, password } = req.body;

  const user = await inviteUserService.approveInvitation(email, role, name, password);
  res.status(httpStatus.OK).json({
    message: `User with email ${email} has been approved and created successfully`,
    data: user,
  });
});

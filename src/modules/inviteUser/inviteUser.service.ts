import httpStatus from 'http-status';
import { ApiError } from '../errors';
import InviteUser from './inviteUser.model';
import User from '../user/user.model'; // Assuming there's a User model for creating users
import nodemailer from 'nodemailer';
import config from '../../config/config'; // Config file for SMTP or environment variables

// Nodemailer transporter setup
export const transporter = nodemailer.createTransport(config.email.smtp);

// Service to invite a user
export const inviteUser = async (email: string, role: string) => {
  // Check if the email is already approved in the InviteUser model
  const existingInvite = await InviteUser.findOne({ email, status: 'approved' });
  if (existingInvite) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email has already been approved and cannot be invited again.');
  }

  // Create an invitation record with status 'pending'
  let invite = await InviteUser.findOneAndUpdate(
    { email },
    { email, role, status: 'pending' },
    { new: true, upsert: true } // Upsert to create or update the record
  );

  // Send an invitation email
  const invitationLink = `${config.clientUrl}/accept-invitation?email=${email}&role=${role}`;
  await transporter.sendMail({
    from: config.email.from,
    to: email,
    subject: 'You have been invited',
    html: `
      <p>You have been invited to join our platform as a ${role}.</p>
      <p> <a href="${invitationLink}">Click Here</a> to accept the invitation.</p>
      
    `,
  });

  return invite;
};

export const approveInvitation = async (email: string, role: string, name: string, password: string) => {
  const invite = await InviteUser.findOne({ email, status: 'pending' });
  if (!invite) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No pending invitation found for this email.');
  }

  const user = await User.create({ email, role, name, password, isEmailVerified: true });

  // Update the invitation status to 'approved'
  invite.status = 'approved';
  await invite.save();

  return user;
};

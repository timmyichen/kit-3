import * as mailgun from 'mailgun-js';
import { Users } from 'server/models';
import { generateEmailHash } from './verifyEmail';
import { getFullName } from './users';

if (!process.env.MAILGUN_API_KEY) {
  throw new Error('Expected mailgun api key');
}

const DOMAIN = 'mail.kit-with.me';
const WEB_BASE_URL = 'https://kit-with.me';

let mg: mailgun.Mailgun | null = null;

if (process.env.NODE_ENV === 'production') {
  mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: DOMAIN,
  });
}

async function sendEmail({
  user,
  subject,
  html,
}: {
  user: { email: string; username?: string };
  subject: string;
  html: string;
}) {
  if (mg) {
    await mg.messages().send({
      from: 'Keep in Touch (KIT) <please@kit-with.me>',
      to: user.email,
      subject,
      html,
    });
  } else {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    console.log(`

  ===========================================
  EMAIL SENT
  to: ${user.email} (${user.username || '~unregistered~'})
  subject: ${subject}
  ===========================================
  ${html}
  ===========================================

    `);
  }
}

export async function sendWelcomeEmail({ user }: { user: Users }) {
  const verifyUrl =
    WEB_BASE_URL + '/account/verify?token=' + generateEmailHash(user.email);

  await sendEmail({
    user,
    subject: 'Welcome to KIT!',
    html: [
      'Welcome to <a href="https://kit-with.me">Keep In Touch</a>!',
      '<br/><br/>',
      `Click <a href="${verifyUrl}">here</a> to verify your email.`,
    ].join('\n<br/>'),
  });
}

export async function sendVerificationEmail({ user }: { user: Users }) {
  const verifyUrl =
    WEB_BASE_URL + '/account/verify?token=' + generateEmailHash(user.email);

  await sendEmail({
    user,
    subject: 'Verify your KIT email',
    html: `Click <a href="${verifyUrl}">here</a> to verify your email.`,
  });
}

export async function sendInviteEmail({
  invitingUser,
  email,
}: {
  invitingUser: Users;
  email: string;
}) {
  // todo: special invite link

  const signupUrl = WEB_BASE_URL + '/signup?referrer=' + invitingUser.id;

  await sendEmail({
    user: { email },
    subject: `${invitingUser.given_name} wants to keep in touch with you!`,
    html: [
      'Hello!',
      '',
      `${invitingUser.given_name} wants to keep in touch with you using Keep In Touch,`,
      'a simple social network dedicated to helping friends stay connected.',
      '',
      `Get started by signing up for an account <a href="${signupUrl}">here</a>!`,
      '',
      'Any questions? Feel free to ask by responding to this email.',
      '',
      'Cheers,',
      'The Keep In Touch team',
    ].join('\n<br/>'),
  });
}

export async function sendFriendRequestEmail({
  requestedUser,
  requestingUser,
}: {
  requestedUser: Users;
  requestingUser: Users;
}) {
  const friendsPageUrl = WEB_BASE_URL + '/friends';

  await sendEmail({
    user: requestedUser,
    subject: `${requestingUser.given_name} has added you as a friend on Keep In Touch!`,
    html: [
      `Hello ${requestedUser.given_name}!`,
      '',
      `${getFullName(
        requestingUser,
      )} wants to keep in touch with you and has added you`,
      'as a friend.',
      '',
      `Accept the invite on your <a href="${friendsPageUrl}">Friends dashboard</a>.`,
      '',
      'Cheers,',
      'The Keep In Touch team',
    ].join('\n<br/>'),
  });
}

export async function sendPasswordResetEmail({
  user,
  newPasswordToken,
}: {
  user: Users;
  newPasswordToken: string;
}) {
  const resetLink =
    WEB_BASE_URL + `/set-password?token=${user.id}:${newPasswordToken}`;

  await sendEmail({
    user,
    subject: 'Keep In Touch Password Reset',
    html: [
      `Hello ${user.given_name},`,
      '',
      "You've requested a password reset. You can reset your password",
      `<a href="${resetLink}">here</a>. The link will work for 24 hours.`,
      '',
      'If you did not request a password reset, please notify us immediately.',
      '',
      'Best,',
      'The KIT Team',
    ].join('\n<br/>'),
  });
}

export async function sendSummaryEmail() {}

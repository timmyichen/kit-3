import * as mailgun from 'mailgun-js';
import { Users } from 'server/models';
import { generateEmailHash } from './verifyEmail';

if (!process.env.MAILGUN_API_KEY) {
  throw new Error('Expected mailgun api key');
}

const DOMAIN = 'mail.kit-with.me';
const WEB_BASE_URL = 'https://dev.kit-with.me';

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
  user: Users;
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
      to: ${user.email} (${user.username})
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
    html: `
      Welcome to <a href="https://kit-with.me">Keep In Touch</a>!
      <br/><br/>
      Click <a href="${verifyUrl}">here</a> to verify your email.
    `,
  });
}

export async function sendVerificationEmail({ user }: { user: Users }) {
  const verifyUrl =
    WEB_BASE_URL + '/account/verify?token=' + generateEmailHash(user.email);

  await sendEmail({
    user,
    subject: 'Verify your KIT email',
    html: `
        Click <a href="${verifyUrl}">here</a> to verify your email.
      `,
  });
}

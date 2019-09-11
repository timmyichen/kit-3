import * as crypto from 'crypto';

const secret = process.env.VERIFICATION_SECRET;

if (!secret) {
  throw new Error('expected verification secret');
}

export function generateEmailHash(email: string) {
  return crypto
    .createHash('sha256')
    .update(secret + ':' + email)
    .digest('hex');
}

export function doesEmailMatchHash(email: string, hash: string) {
  return hash === generateEmailHash(email);
}

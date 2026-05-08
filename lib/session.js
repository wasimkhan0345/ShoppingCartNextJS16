// lib/session.js
import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD, // at least 32 characters
  cookieName: 'shopping_cart_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(req, res) {
  return await getIronSession(req, res, sessionOptions);
}
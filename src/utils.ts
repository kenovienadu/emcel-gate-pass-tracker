import { isNumberString } from 'class-validator';

/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

export type PaginatedQueryType = {
  page?: string | number;
  limit?: string | number;
};

export const hashPassword = (plainPassword: string) => {
  const hash = bcrypt.hashSync(plainPassword, 11);
  return hash;
};

export const createJWTWithPayload = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'sec-key-889754');
  payload.token = token;
  return payload;
};

export const generateJWT = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'sec-key-889754');
  return token as string;
};

export function verifyJWT<T = Record<string, any>>(tokenToVerify: string) {
  try {
    const payload = jwt.verify(
      tokenToVerify,
      process.env.JWT_SECRET || 'sec-key-889754',
    );
    return payload as T;
  } catch (error) {
    return null;
  }
}

export const passwordMatches = (
  plainPassword: string,
  hash: string,
): boolean => {
  const match = bcrypt.compareSync(plainPassword, hash);
  return match;
};

export const normalizeString = (initialValue: string) => {
  return String(initialValue).toLowerCase().trim();
};

export const getPaginationParamsFromQuery = (
  query: PaginatedQueryType = {},
) => {
  const page = isNumberString(query?.page) ? Number(query?.page) : 1;
  const itemsPerPage = isNumberString(query?.limit) ? Number(query?.limit) : 20;
  const skip = page === 1 ? 0 : page * itemsPerPage - itemsPerPage;
  return { page, itemsPerPage, skip };
};

export const getCurrentTimestamp = () => new Date();

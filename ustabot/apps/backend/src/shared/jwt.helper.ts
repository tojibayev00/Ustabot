import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import type { Role } from "@/constants/roles.js";

export interface AccessTokenPayload {
  sub: string; // userId
  telegramId: string;
  role: Role;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string; // userId
  tokenId: string; // refresh token rotation uchun unikal ID
  type: "refresh";
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  if (decoded.type !== "access") {
    throw new jwt.JsonWebTokenError("Noto'g'ri token turi");
  }
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (decoded.type !== "refresh") {
    throw new jwt.JsonWebTokenError("Noto'g'ri token turi");
  }
  return decoded;
}

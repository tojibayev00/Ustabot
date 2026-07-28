import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "@/shared/jwt.helper.js";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

describe("jwt.helper", () => {
  const payload = { sub: "user-1", telegramId: "123456789", role: "USER" as const };

  it("access token yaratadi va to'g'ri tekshiradi", () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.telegramId).toBe(payload.telegramId);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.type).toBe("access");
  });

  it("refresh token yaratadi va to'g'ri tekshiradi", () => {
    const token = signRefreshToken({ sub: "user-1", tokenId: "token-abc" });
    const decoded = verifyRefreshToken(token);

    expect(decoded.sub).toBe("user-1");
    expect(decoded.tokenId).toBe("token-abc");
    expect(decoded.type).toBe("refresh");
  });

  it("access token'ni refresh sifatida tekshirishga urinilsa xatolik beradi", () => {
    const accessToken = signAccessToken(payload);
    expect(() => verifyRefreshToken(accessToken)).toThrow(JsonWebTokenError);
  });

  it("buzilgan tokenni rad etadi", () => {
    expect(() => verifyAccessToken("buzilgan.token.qiymati")).toThrow(JsonWebTokenError);
  });

  it("muddati o'tgan tokenni aniqlaydi", () => {
    // Manfiy expiresIn bilan darhol muddati tugagan token yaratamiz
    const expiredToken = jwt.sign(
      { ...payload, type: "access" },
      process.env.JWT_SECRET as string,
      { expiresIn: -10 }
    );
    expect(() => verifyAccessToken(expiredToken)).toThrow(TokenExpiredError);
  });
});

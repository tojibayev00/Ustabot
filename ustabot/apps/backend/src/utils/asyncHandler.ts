import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, string | undefined>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<unknown>;

/**
 * Har bir controllerda try/catch yozish o'rniga shu wrapper ishlatiladi.
 * Har qanday rad etilgan Promise avtomatik `next(error)` ga uzatiladi,
 * so'ngra error.middleware.ts tomonidan qayta ishlanadi.
 */
export function asyncHandler<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, string | undefined>
>(handler: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>): RequestHandler {
  return (req, res, next) => {
    handler(req as never, res as never, next).catch(next);
  };
}

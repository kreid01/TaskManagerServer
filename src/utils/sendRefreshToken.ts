import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("reksat", token, {
    path: "/refresh_token",
    httpOnly: true,
  });
};
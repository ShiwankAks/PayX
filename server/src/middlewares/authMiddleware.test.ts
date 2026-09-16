import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import verifyToken from "./authMiddleware.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

describe("authMiddleware", () => {
  it("missing header returns json: invalid access", () => {
    const req = {
      header: vi.fn().mockReturnValue(undefined),
    };
    const res = {
      status: vi.fn(),
      json: vi.fn(),
    };
    res.status.mockReturnValue(res);
    const next = vi.fn();
    verifyToken(req as unknown as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized access",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid jwt token", () => {
    const req = {
      header: vi.fn().mockReturnValue("123"),
    };
    const res = {
      status: vi.fn(),
      json: vi.fn(),
    };
    res.status.mockReturnValue(res);
    const next = vi.fn();
    verifyToken(req as unknown as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Please login",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts valid JWT", () => {
    const token = jwt.sign(
      {
        id: 6,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    const req = {
      header: vi
        .fn()
        .mockReturnValue(
          token,
        ),
      user: undefined,
    };
    const res = { status: vi.fn(), json: vi.fn() };
    res.status.mockReturnValue(res);

    const next = vi.fn();
    verifyToken(req as unknown as Request, res as unknown as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.user).toMatchObject({id:6});
  });
});

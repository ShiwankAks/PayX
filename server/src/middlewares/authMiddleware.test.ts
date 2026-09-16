import { describe, it, expect, vi } from "vitest";
import verifyToken from "./authMiddleware.js";
import { Request, Response } from "express";

describe("authMiddleware", () => {
  it("missing header returns json: invalid access", () => {
    const req = {
      header: vi.fn().mockReturnValue(undefined),
    };
    const res = {
      status: vi.fn(),
      json: vi.fn(),
    };
    res.status.mockReturnValue(res)
    const next = vi.fn();
    verifyToken(
      req as unknown as Request,
      res as unknown as Response,
      next,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
        message:"Unauthorized access"
    })
    expect(next).not.toHaveBeenCalled()
  });

  it("rejects invalid jwt token",()=>{})
});

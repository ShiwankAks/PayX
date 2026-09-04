import { JwtPayload } from "jsonwebtoken";

export interface customPayload {
  id: string;
  username?: string;
  phone?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: customPayload;
    }
  }
}

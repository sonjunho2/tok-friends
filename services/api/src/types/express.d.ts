// services/api/src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export {};
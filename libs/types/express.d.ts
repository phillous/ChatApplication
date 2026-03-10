import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string;
    };
  }
}

declare module 'socket.io' {
  interface Socket {
    user: Record<string, any>;
    userId: string;
  }
}
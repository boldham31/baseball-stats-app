import mongoose from "mongoose";

declare global {
  namespace NodeJS {
    interface Global {
      mongooseCache?: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      };
    }
  }
}

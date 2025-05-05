import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI missing");
}

const globalWithCache = global as unknown as NodeJS.Global;

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = { conn: null, promise: null };
}

export default async function connectToDB(): Promise<mongoose.Connection> {
  const cache = globalWithCache.mongooseCache!;

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(process.env.MONGO_URI!)
      .then((m) => m.connection);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

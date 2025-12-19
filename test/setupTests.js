import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '../DB/config/connectDB.js';

let mongo;

console.log('Running tests with in-memory MongoDB (no real DB used)');

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await connectDB(uri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let col of collections) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

console.log("JWT_SECRET (loaded via setupTests):", process.env.JWT_SECRET)
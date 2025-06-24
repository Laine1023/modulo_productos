import dotenv from "dotenv";
import { Redis } from "iovalkey";

dotenv.config();

export const cacheValkey = new Redis({
  port: process.env.VALKEY_PORT || 6379,
  host: process.env.VALKEY_HOST || "localhost"
});


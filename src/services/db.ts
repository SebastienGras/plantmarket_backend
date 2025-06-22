/**
 * Database Configuration Module
 *
 * This module sets up and manages a PostgreSQL connection pool using the `pg` library.
 * It leverages environment variables for secure configuration and includes an asynchronous
 * verification function to confirm connectivity at startup.
 */

import dotenv from "dotenv";
import { Pool } from "pg";

import { loadAllSQLFromRoutes } from "./dal";
import { logger } from "./logger";

dotenv.config();

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

loadAllSQLFromRoutes();

/**
 * Asynchronously verifies the PostgreSQL connection.
 * Ensures that any issues are logged immediately at application startup.
 */
async function verifyConnection(): Promise<void> {
  try {
    const client = await db.connect();
    logger.info("✅ Connected to PostgreSQL database");
    client.release();
  } catch (error) {
    logger.error("❌ Error connecting to the database:", { error });
  }
}

verifyConnection();

export default db;
export type QueryResultRow = Record<string, unknown>;

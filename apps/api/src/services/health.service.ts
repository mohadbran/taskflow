import { sql } from "drizzle-orm";
import { db } from "../db/index.js";

export type HealthStatus = {
  status: "ok";
  service: "taskflow-api";
  database: "ok";
  timestamp: string;
};

export async function getHealth(): Promise<HealthStatus> {
  await db.run(sql`SELECT 1`);

  return {
    status: "ok",
    service: "taskflow-api",
    database: "ok",
    timestamp: new Date().toISOString(),
  };
}
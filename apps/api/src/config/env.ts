const port = Number(process.env.PORT) || 4000;

const nodeEnv = process.env.NODE_ENV || "development";

const clientUrl =
  process.env.CLIENT_URL || "http://localhost:5173";

export const env = {
  port,
  nodeEnv,
  clientUrl,
  isDevelopment: nodeEnv === "development",
  isProduction: nodeEnv === "production",
} as const;
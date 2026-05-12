type Env = {
  DB: D1Database;
  JWT_SECRET: string;
};

export function getEnv(env: Env) {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return {
    DB: env.DB,
    JWT_SECRET: env.JWT_SECRET,
  };
}
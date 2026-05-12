export type AppBindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

export type AppVariables = {
  requestId: string;
};

export type AppHonoEnv = {
  Bindings: AppBindings;
  Variables: AppVariables;
};
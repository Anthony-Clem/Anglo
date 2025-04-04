import { getEnv } from "../utils/get-env";

const envConfig = () => ({
  PORT: getEnv("PORT", "8000"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
});

export const conifg = envConfig();

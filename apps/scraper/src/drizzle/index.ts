import { drizzle } from "drizzle-orm/d1";

const getDB = (env: CloudflareBindings) => {
  return drizzle(env.DB);
};

export default getDB;

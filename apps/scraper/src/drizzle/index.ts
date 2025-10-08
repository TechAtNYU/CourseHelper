import { drizzle } from "drizzle-orm/d1";

const createDB = (env: CloudflareBindings) => {
  return drizzle(env.DB);
};

export default createDB;

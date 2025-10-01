import { drizzle } from "drizzle-orm/d1";

const createDB = async (env: CloudflareBindings) => {
  return drizzle(env.DB);
};

export default createDB;

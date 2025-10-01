import { drizzle } from "drizzle-orm/d1";
import { Env } from "../lib/env";

const createDB = async (env: Env["Bindings"]) => {
  return drizzle(env.DB);
};

export default createDB;

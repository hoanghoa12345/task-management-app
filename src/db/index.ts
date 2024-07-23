import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { schema } from "./schema";

// console.log("DB_HOST: ", process.env.DB_HOST);

// const connection = await mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(poolConnection, {
  schema,
  mode: "default",
});

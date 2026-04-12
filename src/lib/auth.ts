import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { dbConnection } from "../dal/db/client";
import * as appSchema from "../dal/db/schema";
import * as authSchema from "../../auth-schema";

const db = dbConnection();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...appSchema,
      ...authSchema,
    },
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  user: {
    additionalFields: {
      fullName: {
        type: "string",
        required: true,
      },
    },
  },

  plugins: [tanstackStartCookies()],
});
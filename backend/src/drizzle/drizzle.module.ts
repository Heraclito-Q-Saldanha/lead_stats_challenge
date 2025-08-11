import { Module, Global } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const DRIZZLE = "DRIZZLE_CONNECTION";
export type DBConnectionType = NodePgDatabase<typeof schema>;

@Global()
@Module({
    providers: [{
        provide: DRIZZLE,
        useFactory: async () => {
            const pool = new Pool({
                connectionString: process.env.DATABASE_URL
            });
            return drizzle(pool, { schema });
        }
    }],
    exports: [DRIZZLE]
})

export class DrizzleModule { }
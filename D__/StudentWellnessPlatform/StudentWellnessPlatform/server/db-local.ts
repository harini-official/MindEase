import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Hardcode the database connection for local development
const DATABASE_URL = 'postgresql://neondb_owner:npg_bwOnK8XtFo1H@ep-little-term-a5lmghd5.us-east-2.aws.neon.tech:5432/neondb';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
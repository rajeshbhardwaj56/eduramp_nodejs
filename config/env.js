import 'dotenv/config'
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
    PORT: z.coerce.number().int().positive().default(8080),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be greater then 32 character"),
    JWT_EXPIRES: z.string().default("1d")
})

const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
    console.error("Invalid environment variables");

    for (const issues of parsed.error.issues) {
        console.error(` - ${issues.path.join()}: ${issues.message}`)
    }
    process.exit(1);
}

export const env = parsed.data;

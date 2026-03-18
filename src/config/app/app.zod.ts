import { z } from 'zod';
import { NodeEnv } from './node-env.enum';

export const appEnvSchema = z.object({
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(NodeEnv),
});

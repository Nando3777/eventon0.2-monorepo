import { z } from 'zod';

export const healthCheckSchema = z.object({
  status: z.literal('ok'),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;

export const utils = {
  noop: (): void => {
    return;
  },
};

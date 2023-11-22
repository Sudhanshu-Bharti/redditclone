//to setup redis this is the code:

import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_SECRET!,
})

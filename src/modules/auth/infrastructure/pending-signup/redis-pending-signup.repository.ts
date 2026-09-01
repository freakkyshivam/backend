import redisClient from "../../../../infrastructure/redis/redis.client.js";
import type {
  PendingSignupData,
  PendingSignupRepository,
} from "../../interfaces/pending-signup-repository.interface.js";

function getRedisKey(email: string) {
  return `auth:pending-signup:${email}`;
}

export class RedisPendingSignupRepository implements PendingSignupRepository {
  async save(email: string, signupData: PendingSignupData): Promise<void> {
    const key = getRedisKey(email);
    await redisClient.set(key, JSON.stringify(signupData), {
      EX: 300,
    });
  }

  async get(email: string): Promise<PendingSignupData | null> {
    const key = getRedisKey(email);

    const result = await redisClient.get(key);

    if (!result) {
      return null;
    }

    return JSON.parse(result);
  }

  async delete(email: string): Promise<void> {
    const key = getRedisKey(email);
    await redisClient.del(key);
  }
}

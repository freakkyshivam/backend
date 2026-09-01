import redis from "../../../../infrastructure/redis/redis.client.js";
import type { OtpService } from "../../interfaces/otp-service.interface.js";
import crypto from "node:crypto";
export class RedisService implements OtpService {
  // generate and save otp into redis
  async generateOtp(email: string): Promise<string> {
    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpKey = `register:otp:${email}`;
    const attemptsKey = `register:otp:attempts:${email}`;

    await redis.set(otpKey, otp, {
      EX: 300,
    });

    await redis.del(attemptsKey);

    return otp;
  }

  // verify otp
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpKey = `register:otp:${email}`;
    const attemptsKey = `register:otp:attempts:${email}`;

    const redisOtp = await redis.get(otpKey);

    if (!redisOtp) {
      throw new Error("OTP is expired or not found");
    }

    const attempts = Number((await redis.get(attemptsKey)) ?? 0);

    if (attempts >= 5) {
      throw new Error("Maximum OTP attempt exceeded");
    }

    if (redisOtp !== otp) {
      await redis.incr(attemptsKey);

      const remainingTtl = await redis.ttl(otpKey);

      if (remainingTtl > 0) {
        await redis.expire(attemptsKey, remainingTtl);
      }

      throw new Error("Wrong OTP");
    }

    await redis.del([otpKey, attemptsKey]);

    return true;
  }
}

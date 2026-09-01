
import type { pendingSignupData } from "../types/auth.types.js"

export interface PendingSignupRepository {
  save(
    email: string,
    signupData: pendingSignupData
  ): Promise<void>;

  get(
    email: string
  ): Promise<pendingSignupData | null>;

  delete(
    email: string
  ): Promise<void>;
}
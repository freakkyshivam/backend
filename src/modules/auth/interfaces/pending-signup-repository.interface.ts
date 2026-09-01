
export type PendingSignupData = {
  name: string;
  email: string;
  passwordHash: string;
};
export interface PendingSignupRepository {
  save(
    email: string,
    signupData: PendingSignupData
  ): Promise<void>;

  get(
    email: string
  ): Promise<PendingSignupData | null>;

  delete(
    email: string
  ): Promise<void>;
}
import argon2 from "argon2";

import type { PasswordHasher } from "../../interfaces/password-hasher.interface.js";

export  class Argon2PasswordHasher implements PasswordHasher{

    // hash password using argon2
    async hash(password: string): Promise<string> {
        return argon2.hash(password)
    }

    // verify user password 
    async verify(password: string, passwordHash: string): Promise<boolean> {
        return argon2.verify(passwordHash, password)
    }

}
import 'dotenv/config'
import jwt from 'jsonwebtoken';

import type { TokenService } from '../../interfaces/token-service.interface.js';
import type { UserRole } from '../../../../domain/user/user-role.js';

export class JwtTokenService implements TokenService{

    // access token
    generateAccessToken(payload: { userId: string; role: UserRole; }): string {
        return jwt.sign({
            userId : payload.userId,
            role : payload.role
        }, process.env.JWT_ACCESS_SECRET!,{
            expiresIn : '15m'
        })
    }

    // refresh token
    generateRefreshToken(payload: { userId: string; role: UserRole; }): string {
        return jwt.sign({
            userId : payload.userId, 
            role : payload.userId
        },
        process.env.JWT_REFRESH_SECRET!,{
            expiresIn : "7d"
        }
    )
    }

}
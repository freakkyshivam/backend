# MineGov Authentication Flow

## Complete Auth Flow

```text
                         CLIENT
                           │
                           ▼
                       AUTH ROUTES
                           │
                           ▼
                    AUTH CONTROLLER
                           │
                           ▼
                          ZOD
                           │
                           ▼
                      AUTH SERVICE
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
   USER REPOSITORY   PASSWORD REPO    OTP SERVICE
          │                │                 │
          ▼                ▼                 ▼
       DRIZZLE          DRIZZLE       REDIS OTP SERVICE
          │                │                 │
          ▼                ▼                 ▼
     POSTGRESQL       POSTGRESQL          REDIS


                    AUTH SERVICE
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       PASSWORD HASHER        TOKEN SERVICE
              │                     │
              ▼                     ▼
        ARGON2 HASHER          JWT SERVICE
```

---

## 1. Register + OTP Flow

```text
POST /api/v1/auth/register
            │
            ▼
      auth.routes.ts
            │
            ▼
   AuthController.register()
            │
            ▼
      registerSchema
       (Zod validation)
            │
            ├── invalid ──► 400 Response
            │
            ▼
      AuthService.register()
            │
            ▼
   UserRepository.findByEmail()
            │
            ├── exists ────► Error
            │
            ▼
      PasswordHasher.hash()
            │
            ▼
      OtpService.generateOtp()
            │
            ▼
      RedisOtpService
            │
            ▼
       Redis Client
            │
            ▼
          Redis
```

---

## 2. Verify Email Flow

```text
POST /api/v1/auth/verify-email
            │
            ▼
      auth.routes.ts
            │
            ▼
 AuthController.verifyEmail()
            │
            ▼
    verifyEmailSchema
       (Zod validation)
            │
            ├── invalid ──► 400
            │
            ▼
   AuthService.verifyEmail()
            │
            ▼
     OtpService.verifyOtp()
            │
            ▼
      RedisOtpService
            │
            ▼
       Redis Client
            │
            ▼
          Redis
            │
            ├── wrong/expired ──► Error
            │
            ▼
       OTP verified
            │
            ▼
   Get pending signup data
            │
            ▼
   UserRepository.createUser()
            │
            ▼
        PostgreSQL
            │
            ▼
   PasswordRepository.create()
            │
            ▼
        PostgreSQL
            │
            ▼
   Remove pending signup
            │
            ▼
      Success Response
```

---

## 3. Password Hashing Flow

### Inside Registration

```text
AuthService
    │
    ▼
PasswordHasher.hash(password)
    │
    ▼
Argon2PasswordHasher
    │
    ▼
Argon2
    │
    ▼
passwordHash
```

---

## 4. Login Flow

```text
POST /api/v1/auth/login
            │
            ▼
      auth.routes.ts
            │
            ▼
    AuthController.login()
            │
            ▼
       loginSchema
        (Zod)
            │
            ├── invalid ──► 400
            │
            ▼
      AuthService.login()
            │
            ▼
   UserRepository.findByEmail()
            │
            ▼
        PostgreSQL
            │
            ▼
        User found
            │
            ▼
        Check status
            │
            ├── inactive/suspended ──► Error
            │
            ▼
   Check email verification
            │
            ├── not verified ──► Error
            │
            ▼
 PasswordRepository.findByUserId()
            │
            ▼
        PostgreSQL
            │
            ▼
   PasswordHasher.verify()
            │
            ▼
    Argon2PasswordHasher
            │
            ├── false ──► Invalid credentials
            │
            ▼
TokenService.generateAccessToken()
            │
            ▼
      JwtTokenService
            │
            ▼
TokenService.generateRefreshToken()
            │
            ▼
      JwtTokenService
            │
            ▼
      Create Login Session
            │
            ▼
      Refresh token cookie
            │
            ▼
         Response
```

---

## 5. Refresh Token Flow

```text
POST /api/v1/auth/refresh
            │
            ▼
      auth.routes.ts
            │
            ▼
    AuthController.refresh()
            │
            ▼
   Refresh Token Cookie
            │
            ▼
      AuthService.refresh()
            │
            ▼
TokenService.verifyRefreshToken()
            │
            ▼
      JwtTokenService
            │
            ▼
          userId
            │
            ▼
      Session Repository
            │
            ▼
        PostgreSQL
            │
            ▼
    UserRepository.findById()
            │
            ▼
        PostgreSQL
            │
            ▼
       Check status
            │
            ▼
TokenService.generateAccessToken()
            │
            ▼
      New Access Token
            │
            ▼
        Response
```

---

## 6. Authentication Middleware

```text
GET /api/v1/some-protected-route
            │
            ▼
   authenticate middleware
            │
            ▼
     Read Access Token
            │
            ▼
TokenService.verifyAccessToken()
            │
            ▼
      JwtTokenService
            │
            ▼
       userId + role
            │
            ▼
         req.user
            │
            ▼
          next()
```

### Invalid Token

```text
Token
  │
  ▼
verify
  │
  ▼
invalid
  │
  ▼
401 Unauthorized
```

---

## 7. RBAC Flow

```text
Request
   │
   ▼
authenticate()
   │
   ▼
req.user
   │
   ▼
authorize("admin")
   │
   ▼
Check req.user.role
   │
   ├── allowed ──► next()
   │
   └── denied  ──► 403 Forbidden
```

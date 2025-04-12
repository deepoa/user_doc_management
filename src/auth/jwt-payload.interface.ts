// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
    sub: string;      // User ID (subject)
    email: string;    // User email
    role: string;     // User role (admin/editor/viewer)
    iat?: number;     // Issued at (automatic)
    exp?: number;     // Expiration time (automatic)
  }
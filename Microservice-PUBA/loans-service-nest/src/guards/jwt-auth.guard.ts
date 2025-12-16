import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  user_id: number;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      const decoded = jwt.verify(token, secret) as any;

      console.log('[JWT Debug] Decoded token:', decoded);

      // Normalize payload - support both 'id' and 'user_id' fields
      const payload: JwtPayload = {
        user_id: decoded.user_id || decoded.id,
        role: decoded.role || 'mahasiswa', // Default to mahasiswa if no role
      };

      console.log('[JWT Debug] Normalized payload:', payload);

      request.user = payload;
      return true;
    } catch (error) {
      console.error('[JWT Debug] Token verification failed:', error.message);
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}

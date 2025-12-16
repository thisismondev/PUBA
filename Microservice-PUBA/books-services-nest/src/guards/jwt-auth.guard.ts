import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  user_id: number;
  role: 'mahasiswa' | 'admin';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET tidak dikonfigurasi di environment');
      }

      const payload = jwt.verify(token, secret) as any;
      
      // Normalize payload - support both 'id' and 'user_id'
      const normalizedPayload: JwtPayload = {
        user_id: payload.user_id || payload.id,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
      };
      
      // Validate payload structure
      if (!normalizedPayload.user_id || !normalizedPayload.role) {
        console.log('[JWT Debug] Invalid payload structure:', normalizedPayload);
        throw new UnauthorizedException('Token payload tidak valid');
      }

      // Attach user payload to request object
      request['user'] = normalizedPayload;
      return true;
    } catch (error) {
      console.log('[JWT Debug] Error:', error.message, 'Name:', error.name);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token telah expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token tidak valid');
      }
      throw new UnauthorizedException('Autentikasi gagal');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    
    return type === 'Bearer' ? token : undefined;
  }
}

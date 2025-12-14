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

      const payload = jwt.verify(token, secret) as JwtPayload;
      
      // Validate payload structure
      if (!payload.user_id || !payload.role) {
        throw new UnauthorizedException('Token payload tidak valid');
      }

      // Attach user payload to request object
      request['user'] = payload;
      
      return true;
    } catch (error) {
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

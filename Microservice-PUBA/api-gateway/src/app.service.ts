import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getGatewayInfo() {
    return {
      name: 'PUBA API Gateway',
      version: '1.0.0',
      description: 'Reverse Proxy for Microservices Architecture',
      routes: {
        users: {
          prefix: '/users',
          target: this.configService.get('USERS_SERVICE_URL'),
          description: 'Authentication and User Management',
        },
        books: {
          prefix: '/books',
          target: this.configService.get('BOOKS_SERVICE_URL'),
          description: 'Book and Book Item Management',
        },
        loans: {
          prefix: '/loans',
          target: this.configService.get('LOANS_SERVICE_URL'),
          description: 'Loan and Fine Management',
        },
      },
      endpoints: {
        health: '/health',
        info: '/',
      },
    };
  }
}

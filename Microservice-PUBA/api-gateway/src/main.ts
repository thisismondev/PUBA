import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as express from 'express';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Gateway');

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Get service URLs from environment
  const usersServiceUrl = configService.get<string>('USERS_SERVICE_URL');
  const booksServiceUrl = configService.get<string>('BOOKS_SERVICE_URL');
  const loansServiceUrl = configService.get<string>('LOANS_SERVICE_URL');

  logger.log('=== API Gateway Configuration ===');
  logger.log(`Users Service: ${usersServiceUrl}`);
  logger.log(`Books Service: ${booksServiceUrl}`);
  logger.log(`Loans Service: ${loansServiceUrl}`);

  // Get Express instance
  const expressApp = app.getHttpAdapter().getInstance() as express.Application;

  /**
   * PROXY MIDDLEWARE: Users Service
   * Route: /users/* → http://localhost:3000/*
   */
  expressApp.use(
    '/users',
    createProxyMiddleware({
      target: usersServiceUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/users': '', // Strip /users prefix
      },
      on: {
        proxyReq: (proxyReq, req, res) => {
          // Preserve Authorization header
          const authHeader = req.headers.authorization;
          if (authHeader) {
            proxyReq.setHeader('Authorization', authHeader);
          }

          const expressReq = req as Request;
          logger.debug(
            `[Users Proxy] ${expressReq.method} ${expressReq.originalUrl} → ${usersServiceUrl}${expressReq.url}`,
          );
        },
        error: (err, req, res) => {
          logger.error(`[Users Proxy Error] ${err.message}`);
          const expressRes = res as Response;
          expressRes.writeHead(502, { 'Content-Type': 'application/json' });
          expressRes.end(
            JSON.stringify({
              statusCode: 502,
              message: 'Users Service unavailable',
              error: 'Bad Gateway',
            }),
          );
        },
      },
    }),
  );

  /**
   * PROXY MIDDLEWARE: Books Service
   * Route: /books/* → http://localhost:3001/*
   */
  expressApp.use(
    '/books',
    createProxyMiddleware({
      target: booksServiceUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/books': '', // Strip /books prefix
      },
      on: {
        proxyReq: (proxyReq, req, res) => {
          // Preserve Authorization header
          const authHeader = req.headers.authorization;
          if (authHeader) {
            proxyReq.setHeader('Authorization', authHeader);
          }

          const expressReq = req as Request;
          logger.debug(
            `[Books Proxy] ${expressReq.method} ${expressReq.originalUrl} → ${booksServiceUrl}${expressReq.url}`,
          );
        },
        error: (err, req, res) => {
          logger.error(`[Books Proxy Error] ${err.message}`);
          const expressRes = res as Response;
          expressRes.writeHead(502, { 'Content-Type': 'application/json' });
          expressRes.end(
            JSON.stringify({
              statusCode: 502,
              message: 'Books Service unavailable',
              error: 'Bad Gateway',
            }),
          );
        },
      },
    }),
  );

  /**
   * PROXY MIDDLEWARE: Loans Service
   * Route: /loans/* → http://localhost:3002/*
   */
  expressApp.use(
    '/loans',
    createProxyMiddleware({
      target: loansServiceUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/loans': '', // Strip /loans prefix
      },
      on: {
        proxyReq: (proxyReq, req, res) => {
          // Preserve Authorization header
          const authHeader = req.headers.authorization;
          if (authHeader) {
            proxyReq.setHeader('Authorization', authHeader);
          }

          const expressReq = req as Request;
          logger.debug(
            `[Loans Proxy] ${expressReq.method} ${expressReq.originalUrl} → ${loansServiceUrl}${expressReq.url}`,
          );
        },
        error: (err, req, res) => {
          logger.error(`[Loans Proxy Error] ${err.message}`);
          const expressRes = res as Response;
          expressRes.writeHead(502, { 'Content-Type': 'application/json' });
          expressRes.end(
            JSON.stringify({
              statusCode: 502,
              message: 'Loans Service unavailable',
              error: 'Bad Gateway',
            }),
          );
        },
      },
    }),
  );

  // Health check endpoint
  expressApp.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        users: usersServiceUrl,
        books: booksServiceUrl,
        loans: loansServiceUrl,
      },
    });
  });

  // Start server
  const port = configService.get<number>('PORT', 8080);
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 API Gateway running on http://localhost:${port}`);
  logger.log(`📍 Health Check: http://localhost:${port}/health`);
  logger.log('=================================');
}

bootstrap();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('LiquidityController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /liquidity/token/:token/best-route', () => {
    it('should return 400 for invalid parameters', () => {
      return request(app.getHttpServer())
        .get('/api/v1/liquidity/token/INJ/best-route?amount=-100')
        .expect(400);
    });

    it('should return 400 for invalid side', () => {
      return request(app.getHttpServer())
        .get('/api/v1/liquidity/token/INJ/best-route?amount=100&side=invalid')
        .expect(400);
    });
  });

  describe('GET /liquidity/market/:marketId/analysis', () => {
    it('should return 400 for invalid marketId', () => {
      return request(app.getHttpServer())
        .get('/api/v1/liquidity/market/invalid')
        .expect(400);
    });
  });

  describe('GET /liquidity/opportunities/arbitrage', () => {
    it('should return arbitrage opportunities', () => {
      return request(app.getHttpServer())
        .get('/api/v1/liquidity/opportunities/arbitrage?minSpread=0.5')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('opportunities');
          expect(res.body).toHaveProperty('count');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('should return 400 for negative minSpread', () => {
      return request(app.getHttpServer())
        .get('/api/v1/liquidity/opportunities/arbitrage?minSpread=-1')
        .expect(400);
    });
  });

  describe('POST /webhooks/subscribe', () => {
    it('should create webhook subscription', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhooks/subscribe')
        .send({
          url: 'https://example.com/webhook',
          eventType: 'arbitrage',
          threshold: 0.5,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('subscriptionId');
          expect(res.body).toHaveProperty('url');
          expect(res.body).toHaveProperty('eventType');
        });
    });

    it('should return 400 for invalid URL', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhooks/subscribe')
        .send({
          url: 'invalid-url',
          eventType: 'arbitrage',
        })
        .expect(400);
    });

    it('should return 400 for invalid eventType', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhooks/subscribe')
        .send({
          url: 'https://example.com/webhook',
          eventType: 'invalid',
        })
        .expect(400);
    });
  });

  describe('GET /health', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('details');
        });
    });
  });
});

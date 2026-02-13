# Deployment Guide

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## Environment Setup

### 1. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

### 2. Required Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Injective Network
INJECTIVE_NETWORK=testnet
INJECTIVE_CHAIN_ID=injective-888

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# TimescaleDB
DATABASE_HOST=timescaledb
DATABASE_PORT=5432
DATABASE_NAME=liquidity_intelligence
```

## Docker Deployment

### 1. Build and Start Services

```bash
cd docker
docker-compose up -d
```

### 2. Verify Services

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f api
```

### 3. Access Points

- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/api/v1/health
- **Bull Board:** http://localhost:3001

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace liquidity-api
```

### 2. Apply ConfigMap

```bash
kubectl apply -f k8s/configmap.yaml
```

### 3. Apply Secrets

```bash
kubectl apply -f k8s/secrets.yaml
```

### 4. Deploy Services

```bash
kubectl apply -f k8s/
```

### 5. Verify Deployment

```bash
kubectl get pods -n liquidity-api
kubectl get svc -n liquidity-api
```

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure CORS for production domains
- [ ] Set up SSL/TLS termination
- [ ] Configure log retention
- [ ] Set up monitoring alerts
- [ ] Enable rate limiting
- [ ] Configure backup strategy

## Scaling

### Horizontal Scaling

```bash
# Scale API replicas
kubectl scale deployment liquidity-api --replicas=3 -n liquidity-api
```

### Resource Limits

```yaml
resources:
  limits:
    cpu: "1"
    memory: "1Gi"
  requests:
    cpu: "500m"
    memory: "512Mi"
```

## Monitoring

### Health Checks

The API exposes health check endpoints:
- `/api/v1/health` - Main health check
- `/ready` - Readiness probe
- `/live` - Liveness probe

### Logging

```bash
# View API logs
docker-compose logs -f api

# View structured logs
kubectl logs -n liquidity-api -l app=liquidity-api
```

### Metrics

Access Prometheus metrics at `/metrics` endpoint.

## Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs api
```

**Database connection failed:**
```bash
# Verify TimescaleDB is running
docker-compose ps timescaledb
```

**Redis connection refused:**
```bash
# Check Redis status
docker-compose exec redis redis-cli ping
```

### Reset Deployment

```bash
# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# Restart
docker-compose up -d
```

## Security Recommendations

1. Use secrets management for sensitive data
2. Enable network policies
3. Regular security updates
4. Audit logging
5. Rate limiting per user (if auth enabled)

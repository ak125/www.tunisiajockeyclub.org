# Tests Essentiels - Tunisia Jockey Club

## Installation
```bash
cd backend
npm install -D jest @nestjs/testing supertest @types/jest
```

## Configuration Jest
```json
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

## Tests Prioritaires

### 1. Auth Tests (CRITIQUE)
```typescript
// auth/auth.service.spec.ts
describe('AuthService', () => {
  it('should validate strong passwords', () => {
    const result = authService.validateStrongPassword('Test123!');
    expect(result.isValid).toBe(true);
  });
  
  it('should reject weak passwords', () => {
    const result = authService.validateStrongPassword('123');
    expect(result.isValid).toBe(false);
  });
});
```

### 2. Security Tests (CRITIQUE)
```typescript
// security/security.service.spec.ts
describe('SecurityService', () => {
  it('should detect SQL injection', () => {
    const result = securityService.detectSQLInjection("'; DROP TABLE users; --");
    expect(result).toBe(true);
  });
  
  it('should sanitize XSS attempts', () => {
    const result = securityService.sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
  });
});
```

### 3. Cache Tests (IMPORTANT)
```typescript
// cache/cache.service.spec.ts
describe('CacheService', () => {
  it('should cache and retrieve data', async () => {
    await cacheService.set('test', { data: 'value' });
    const result = await cacheService.get('test');
    expect(result.data).toBe('value');
  });
});
```

## Commandes
```bash
# Lancer les tests
npm run test

# Tests avec coverage
npm run test:cov

# Tests en mode watch
npm run test:watch
```

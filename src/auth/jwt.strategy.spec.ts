import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return user object from payload', () => {
    const payload = { sub: 1, email: 'test@test.com' };
    const result = strategy.validate(payload);
    expect(result).toEqual({ userId: 1, email: 'test@test.com' });
  });
});

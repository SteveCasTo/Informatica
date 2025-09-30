export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  expiration: process.env.JWT_EXPIRATION || '24h',
}
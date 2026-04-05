import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const generateToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  // Simple JWT-like token (in production use jsonwebtoken library)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64')

  return `${header}.${body}.${signature}`
}

export const validateToken = (token: string): { userId: string; email: string } | null => {
  try {
    const [header, body, signature] = token.split('.')
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64')

    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(Buffer.from(body, 'base64').toString())
    
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return { userId: payload.userId, email: payload.email }
  } catch {
    return null
  }
}

export const hashPassword = (password: string): string => {
  // PBKDF2 hashing
  return crypto
    .pbkdf2Sync(password, 'salt', 1000, 64, 'sha512')
    .toString('hex')
}

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}

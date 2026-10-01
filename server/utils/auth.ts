import { SignJWT, jwtVerify } from 'jose'

export interface AuthTokenPayload {
  userId: number
  role: 'ADMIN' | 'MANAGER'
}

function getSecret(secret: string) {
  return new TextEncoder().encode(secret)
}

export async function createAuthToken(
  payload: AuthTokenPayload,
  secret: string
) {
  return await new SignJWT({
    userId: payload.userId,
    role: payload.role
  })
    .setProtectedHeader({
      alg: 'HS256'
    })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret(secret))
}

export async function verifyAuthToken(
  token: string,
  secret: string
) {
  const { payload } = await jwtVerify(
    token,
    getSecret(secret)
  )

  return payload as unknown as AuthTokenPayload
}
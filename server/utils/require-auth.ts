import { prisma } from '~/server/utils/prisma'
import { verifyAuthToken } from '~/server/utils/auth'

export async function requireAuth(event: any) {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const config = useRuntimeConfig()

  if (!config.authSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Auth secret is not configured'
    })
  }

  try {
    const payload = await verifyAuthToken(
      token,
      config.authSecret
    )

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!user || !user.isActive) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    return user
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
}

export async function requireAdmin(event: any) {
  const user = await requireAuth(event)

  if (user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }

  return user
}
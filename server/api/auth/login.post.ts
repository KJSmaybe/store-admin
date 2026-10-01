import bcrypt from 'bcryptjs'

import type { LoginInput } from '~/types/user'

import { prisma } from '~/server/utils/prisma'
import { createAuthToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginInput>(event)

  const email = body.email
    ?.trim()
    .toLowerCase()

  const password = body.password

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  if (!user.isActive) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User is inactive'
    })
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordMatches) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  const config = useRuntimeConfig()

  if (!config.authSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Auth secret is not configured'
    })
  }

  const token = await createAuthToken(
    {
      userId: user.id,
      role: user.role
    },
    config.authSecret
  )

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  }
})
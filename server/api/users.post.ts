    import bcrypt from 'bcryptjs'

import type {
  CreateUserInput,
  UserRole
} from '~/types/user'

import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/require-auth'

const roles: UserRole[] = [
  'ADMIN',
  'MANAGER'
]

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody<CreateUserInput>(event)

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }

  if (!password || password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must contain at least 8 characters'
    })
  }

  if (!roles.includes(body.role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user role'
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User with this email already exists'
    })
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  )

  return await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: body.role
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
})
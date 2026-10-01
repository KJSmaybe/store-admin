import bcrypt from 'bcryptjs'

import type { RegisterInput } from '~/types/user'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const usersCount = await prisma.user.count()

  // Этот endpoint нужен только для первоначального
  // создания первого администратора.
  if (usersCount > 0) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Registration is disabled'
    })
  }

  const body = await readBody<RegisterInput>(event)

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

  const passwordHash = await bcrypt.hash(password, 12)

  return await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'ADMIN'
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
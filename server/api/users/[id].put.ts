import type {
  UpdateUserInput,
  UserRole
} from '~/types/user'

import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/require-auth'

const roles: UserRole[] = [
  'ADMIN',
  'MANAGER'
]

export default defineEventHandler(async (event) => {
  const currentUser = await requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user id'
    })
  }

  const body = await readBody<UpdateUserInput>(event)

  const targetUser = await prisma.user.findUnique({
    where: {
      id
    }
  })

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  if (
    body.role !== undefined &&
    !roles.includes(body.role)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user role'
    })
  }

  /*
   * Не позволяем администратору случайно
   * заблокировать самого себя.
   */
  if (
    currentUser.id === id &&
    body.isActive === false
  ) {
    throw createError({
      statusCode: 409,
      statusMessage: 'You cannot deactivate your own account'
    })
  }

  /*
   * И не позволяем самому себе убрать ADMIN.
   */
  if (
    currentUser.id === id &&
    body.role &&
    body.role !== 'ADMIN'
  ) {
    throw createError({
      statusCode: 409,
      statusMessage: 'You cannot change your own admin role'
    })
  }

  /*
   * Дополнительная защита последнего активного ADMIN.
   */
  const removingAdmin =
    targetUser.role === 'ADMIN' &&
    (
      body.role === 'MANAGER' ||
      body.isActive === false
    )

  if (removingAdmin) {
    const activeAdmins = await prisma.user.count({
      where: {
        role: 'ADMIN',
        isActive: true
      }
    })

    if (activeAdmins <= 1) {
      throw createError({
        statusCode: 409,
        statusMessage: 'At least one active admin is required'
      })
    }
  }

  return await prisma.user.update({
    where: {
      id
    },

    data: {
      ...(body.role !== undefined && {
        role: body.role
      }),

      ...(body.isActive !== undefined && {
        isActive: body.isActive
      })
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
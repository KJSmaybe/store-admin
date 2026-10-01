import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
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
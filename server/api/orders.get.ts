import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc'
    },

    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })
})
import type { OrderStatus } from '~/types/order'

import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/require-auth'

import {
  ORDER_STATUSES,
  ALLOWED_ORDER_TRANSITIONS
} from '~/utils/order-status'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order id is required'
    })
  }

  const id = Number(idParam)

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid order id'
    })
  }

  const body = await readBody<{
    status: OrderStatus
  }>(event)

  if (!ORDER_STATUSES.includes(body.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid order status'
    })
  }

  const existingOrder = await prisma.order.findUnique({
    where: {
      id
    },

    include: {
      items: true
    }
  })

  if (!existingOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Order not found'
    })
  }

  const currentStatus =
    existingOrder.status as OrderStatus

  const newStatus = body.status

  if (currentStatus === newStatus) {
    return await prisma.order.findUnique({
      where: {
        id
      },

      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
  }

  if (
    !ALLOWED_ORDER_TRANSITIONS[
      currentStatus
    ].includes(newStatus)
  ) {
    throw createError({
      statusCode: 409,
      statusMessage:
        `Cannot change order status from ${currentStatus} to ${newStatus}`
    })
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.order.updateMany({
      where: {
        id,
        status: currentStatus
      },

      data: {
        status: newStatus
      }
    })

    if (result.count !== 1) {
      throw createError({
        statusCode: 409,
        statusMessage:
          'Order status has already changed'
      })
    }

    if (newStatus === 'CANCELLED') {
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: {
            id: item.productId
          },

          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }
    }

    return await tx.order.findUnique({
      where: {
        id
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
})
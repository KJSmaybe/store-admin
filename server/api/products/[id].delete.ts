import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product id is required'
    })
  }

  const id = Number(idParam)

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product id'
    })
  }

  const existingProduct =
    await prisma.product.findUnique({
      where: { id }
    })

  if (!existingProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }

  return await prisma.product.delete({
    where: { id }
  })
})
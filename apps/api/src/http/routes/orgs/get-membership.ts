import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { authMiddleware } from '@/http/middlewares/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authMiddleware)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get user membership on organization.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().cuid2(),
                organizationId: z.string().cuid2(),
                role: roleSchema,
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        return {
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId,
          },
        }
      },
    )
}

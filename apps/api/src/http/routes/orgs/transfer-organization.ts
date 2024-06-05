import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify/types/instance'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { getUserPermission } from '@/utils/get-user-permission'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function transferOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/organizations/:slug/owner',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Transfer organization ownership',
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          transferToUserId: z.string().cuid2(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()

      const { membership, organization } = await request.getUserMembership(slug)

      const authOrganization = organizationSchema.parse(organization)

      const { cannot } = getUserPermission(userId, membership.role)

      if (cannot('transfer_ownership', authOrganization)) {
        throw new UnauthorizedError(
          "You're not allowed to transfer owner for this organization ",
        )
      }

      const { transferToUserId } = request.body

      const transferToMembership = await prisma.member.findUnique({
        where: {
          userId_organizationId: {
            organizationId: organization.id,
            userId: transferToUserId,
          },
        },
      })

      if (!transferToMembership) {
        throw new BadRequestError(
          'Target user is not a member of this organization.',
        )
      }

      await prisma.$transaction([
        prisma.member.update({
          where: {
            userId_organizationId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
          data: {
            role: 'ADMIN',
          },
        }),
        prisma.organization.update({
          where: { id: organization.id },
          data: {
            ownerId: transferToUserId,
          },
        }),
      ])

      return reply.status(204).send()
    },
  )
}

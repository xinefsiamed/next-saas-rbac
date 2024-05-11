import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-id' })

const project = projectSchema.parse({
  id: 'project-id',
  ownerId: 'user3-id',
})

console.log(ability.can('delete', project))

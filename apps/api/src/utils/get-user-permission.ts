import { defineAbilityFor, type Role, userSchema } from '@saas/auth'

export function getUserPermission(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}

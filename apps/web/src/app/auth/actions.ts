'use server'

import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSignUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSignUrl.searchParams.set('client_id', 'Ov23liHSsGBVfrWSb62O')
  githubSignUrl.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback',
  )
  githubSignUrl.searchParams.set('scope', 'user')

  redirect(githubSignUrl.toString())
}

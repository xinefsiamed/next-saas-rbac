import { api } from './api-client'

interface signInWithGithubRequestBody {
  code: string
}

interface signInWithGithubResponse {
  token: string
}

export async function signInWithGithubRequest({
  code,
}: signInWithGithubRequestBody) {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<signInWithGithubResponse>()

  return result
}

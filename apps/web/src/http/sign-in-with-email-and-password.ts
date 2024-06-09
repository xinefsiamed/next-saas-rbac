import { api } from './api-client'

interface signInWithEmailAndPasswordRequestBody {
  email: string
  password: string
}

interface signInWithEmailAndPasswordResponse {
  token: string
}

export async function signInWithEmailAndPasswordRequest({
  email,
  password,
}: signInWithEmailAndPasswordRequestBody) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<signInWithEmailAndPasswordResponse>()

  return result
}

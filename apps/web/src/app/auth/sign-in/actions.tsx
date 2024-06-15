'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { signInWithEmailAndPasswordRequest } from '@/http/sign-in-with-email-and-password'

const signInSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email address' }),
  password: z.string().min(6, { message: 'Please, provide your password' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithEmailAndPasswordRequest({
      email,
      password,
    })

    cookies().set('token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.log(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}

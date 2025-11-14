'use server'

import { cookies } from 'next/headers'

export async function deleteCookie() {
  (await cookies()).delete(process.env.JWT_COOKIE_NAME!)
}
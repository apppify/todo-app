'use client'

import { SignIn } from '@clerk/nextjs'
import React from 'react'

export const Login = () => {
  return (
    <>
      <h1>Sign in or sign up</h1>
      <div>
        <SignIn fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/onboarding" />
      </div>
    </>
  )
}

'use client';

import React from 'react';

import { SignIn } from '@clerk/nextjs';

export const Login = () => {
  return (
    <>
      <h1>Sign in or sign up</h1>
      <div>
        <SignIn fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/onboarding" />
      </div>
    </>
  );
};

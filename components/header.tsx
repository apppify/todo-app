'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Logo } from './ui/logo'

export const Header = () => {
  return (
    <header className='bg-secondary'>
      <div className="container max-w-screen-lg mx-auto">

        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <Link href="/" className="inline-flex gap-2 items-center">
              <Logo />
              <span className="text-xl font-bold">Apppify Todo</span>
            </Link>
            <nav className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Sprints
              </Link>
            </nav>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

import SvgLogo from '@/app/apppify.svg'
import { cva, type VariantProps } from "class-variance-authority"
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import React from 'react'

import { cn } from "@/lib/utils"

const logoVariants = cva(
  "inline-flex",
  {
    variants: {
      size: {
        default: "size-9",
        sm: "size-8",
        lg: "size-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type LogoProps = Omit<ImageProps, 'src' | 'alt'> & VariantProps<typeof logoVariants>

export const Logo: React.FC<LogoProps> = ({ className, size, ...props }) => {
  return (
    <Image alt='logo' src={SvgLogo} className={cn(logoVariants({ size, className }))} {...props} />
  )
}
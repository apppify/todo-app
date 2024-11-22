"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

export default function NewSprintModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">New sprint</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Teams
          </DialogTitle>
          <DialogDescription>
            List of departments and teams
          </DialogDescription>
        </DialogHeader>
        <div className="">
          hello
        </div>
      </DialogContent>
    </Dialog>
  )
}


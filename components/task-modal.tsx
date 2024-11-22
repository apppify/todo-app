import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Check, User } from 'lucide-react'
import StatusBadge from '@/components/status-badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { motion } from 'framer-motion'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    content: string
    description: string
    dueDate: string
    status: string
    assignedTo: string[]
  }
  onSave: (updatedTask: any) => void
}

const statuses = ['To Do', 'In Progress', 'Done', 'Canceled']
const users = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams']

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState(task)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value })
  }

  const handleStatusChange = (status: string) => {
    setEditedTask({ ...editedTask, status })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedTask({ ...editedTask, dueDate: format(date, 'yyyy-MM-dd') })
      setIsCalendarOpen(false)
    }
  }

  const handleAssignedToChange = (user: string) => {
    const updatedAssignedTo = editedTask.assignedTo.includes(user)
      ? editedTask.assignedTo.filter(u => u !== user)
      : [...editedTask.assignedTo, user]
    setEditedTask({ ...editedTask, assignedTo: updatedAssignedTo })
  }

  const handleSave = () => {
    onSave(editedTask)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to your task here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <motion.div
          className="grid gap-4 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="content" className="text-right text-sm font-medium">Task</label>
            <Input
              id="content"
              name="content"
              value={editedTask.content}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium">Description</label>
            <Textarea
              id="description"
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium">Status</span>
            <div className="col-span-3 flex flex-wrap gap-2">
              {statuses.map(status => (
                <StatusBadge
                  key={status}
                  status={status}
                  isSelected={editedTask.status === status}
                  onClick={() => handleStatusChange(status)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium">Assigned To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start">
                  <User className="mr-2 h-4 w-4" />
                  {editedTask.assignedTo.length > 0
                    ? editedTask.assignedTo.join(', ')
                    : 'Assign users...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    {users.map(user => (
                      <CommandItem
                        key={user}
                        onSelect={() => handleAssignedToChange(user)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${editedTask.assignedTo.includes(user) ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                        {user}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium">Due Date</span>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate ? format(new Date(editedTask.dueDate), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskModal


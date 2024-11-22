import React from 'react'

import Task from './Task'
import { motion } from 'framer-motion'

interface ColumnProps {
  id: string
  title: string
  tasks: {
    id: string
    content: string
    description: string
    dueDate: string
    status: string
    assignedTo: string[]
  }[]
  onTaskClick: (taskId: string) => void
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, onTaskClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-80">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                id={task.id}
                index={index}
                content={task.content}
                description={task.description}
                dueDate={task.dueDate}
                status={task.status}
                assignedTo={task.assignedTo}
                onClick={() => onTaskClick(task.id)}
              />
            ))}
            {provided.placeholder}
          </motion.div>
        )}
      </Droppable>
    </div>
  )
}

export default Column


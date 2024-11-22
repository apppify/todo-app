import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import { CalendarIcon, UserIcon } from 'lucide-react'

interface TaskProps {
  id: string
  index: number
  content: string
  description: string
  dueDate: string
  status: string
  assignedTo: string[] | string
  onClick: () => void
}

const Task: React.FC<TaskProps> = ({ id, index, content, dueDate, assignedTo, status, onClick }) => {
  const assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo].filter(Boolean);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={onClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="font-semibold mb-2 text-gray-800">{content}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{dueDate}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>{assignedToArray.join(', ')}</span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'To Do' ? 'bg-blue-100 text-blue-800' :
                  status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'Done' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                }`}>
                {status}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  )
}

export default Task


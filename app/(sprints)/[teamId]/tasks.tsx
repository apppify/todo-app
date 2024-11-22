'use client'

import React, { useState, useEffect } from 'react'
import Column from '@/components/column'
import TaskModal from '@/components/task-modal'
import TaskInput from '@/components/task-input'
import { v4 as uuidv4 } from 'uuid'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

// This would be replaced with actual database calls
const mockDatabaseCalls = {
  fetchInitialData: (teamId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          tasks: {
            'task-1': {
              id: 'task-1',
              content: 'Take out the garbage',
              description: 'Remember to separate recyclables',
              dueDate: '2023-07-20',
              status: 'To Do',
              assignedTo: ['John Doe'],
              teamId: '1'
            },
            'task-2': {
              id: 'task-2',
              content: 'Watch my favorite show',
              description: 'New episode airs tonight',
              dueDate: '2023-07-21',
              status: 'To Do',
              assignedTo: ['Jane Smith'],
              teamId: '1'
            },
            'task-3': {
              id: 'task-3',
              content: 'Charge my phone',
              description: 'Phone battery is low',
              dueDate: '2023-07-19',
              status: 'In Progress',
              assignedTo: ['John Doe'],
              teamId: '1'
            },
            'task-4': {
              id: 'task-4',
              content: 'Cook dinner',
              description: 'Try new recipe for pasta',
              dueDate: '2023-07-20',
              status: 'To Do',
              assignedTo: ['Jane Smith'],
              teamId: '1'
            },
          },
          columns: {
            'column-1': {
              id: 'column-1',
              title: 'Tasks',
              taskIds: ['task-1', 'task-2', 'task-4'],
            },
            'column-2': {
              id: 'column-2',
              title: 'In Progress',
              taskIds: ['task-3'],
            },
            'column-3': {
              id: 'column-3',
              title: 'Done',
              taskIds: [],
            },
          },
          columnOrder: ['column-1', 'column-2', 'column-3'],
        })
      }, 1000)
    })
  },
  updateTaskOrder: (newState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newState)
      }, 500)
    })
  },
  addNewTask: (newTask) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newTask)
      }, 500)
    })
  },
  updateTask: (updatedTask) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(updatedTask)
      }, 500)
    })
  },
}

export const Tasks: React.FC = () => {
  const [state, setState] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const teamId = searchParams.get('team') || '1'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await mockDatabaseCalls.fetchInitialData(teamId)
      setState(data)
      setLoading(false)
    }
    fetchData()
  }, [teamId])

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = state.columns[source.droppableId]
    const finish = state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      }

      setState(newState)
      await mockDatabaseCalls.updateTaskOrder(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }
    setState(newState)
    await mockDatabaseCalls.updateTaskOrder(newState)
  }

  const openTaskModal = (taskId: string) => {
    setSelectedTask(state.tasks[taskId])
  }

  const closeTaskModal = () => {
    setSelectedTask(null)
  }

  const addNewTask = async (taskContent: string) => {
    const newTaskId = uuidv4()
    const newTask = {
      id: newTaskId,
      content: taskContent,
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'To Do',
      assignedTo: [],
      teamId
    }

    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [newTaskId]: newTask
      },
      columns: {
        ...state.columns,
        'column-1': {
          ...state.columns['column-1'],
          taskIds: [...state.columns['column-1'].taskIds, newTaskId]
        }
      }
    }

    setState(newState)
    await mockDatabaseCalls.addNewTask(newTask)
  }

  const updateTask = async (updatedTask) => {
    const newState = {
      ...state,
      tasks: {
        ...state.tasks,
        [updatedTask.id]: updatedTask
      }
    }

    setState(newState)
    await mockDatabaseCalls.updateTask(updatedTask)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Tasks</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              {state.columnOrder.map((columnId) => {
                const column = state.columns[columnId]
                const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

                return (
                  <Column
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    tasks={tasks}
                    onTaskClick={openTaskModal}
                  />
                )
              })}
            </div>
          </DragDropContext>
        </motion.div>
        {selectedTask && (
          <TaskModal
            isOpen={!!selectedTask}
            onClose={closeTaskModal}
            task={selectedTask}
            onSave={updateTask}
          />
        )}
        <TaskInput onAddTask={addNewTask} />
      </main>
    </div>
  )
}
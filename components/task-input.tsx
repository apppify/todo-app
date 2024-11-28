import React, { use, useState } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TodoContext } from '@/providers/todo.provider';

const TaskInput = () => {
  const { addTodo } = use(TodoContext);
  const [taskContent, setTaskContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskContent.trim()) {
      addTodo(taskContent);
      setTaskContent('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4"
    >
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          className="flex-grow shadow-sm"
        />
        <Button type="submit" className="shadow-sm">
          <PlusIcon className="w-5 h-5 mr-1" />
          Add
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;

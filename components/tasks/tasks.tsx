'use client';

import { TodoContext } from '@/providers/todo.provider';
import React, { use, useEffect, useRef } from 'react';
import { Editor } from '../editor/editor';



export const Tasks: React.FC = () => {
  const editorWrapper = useRef<HTMLDivElement>(null);
  const { todos } = use(TodoContext);

  useEffect(() => {
    if (editorWrapper.current) {
      const editor = new Editor({
        holder: editorWrapper.current,
        onReady: () => {
          console.log('Editor is ready');
        },
        onFailure: (error) => {
          console.error('Editor failed to initialize', error);
        },
      });
    }
  }, [editorWrapper]);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div id="editor-wrapper" ref={editorWrapper} />
    </main>
  );
};

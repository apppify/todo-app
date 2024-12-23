'use client';

import React, { use, useEffect, useRef, useState } from 'react';

import { TodoContext } from '@/providers/todo.provider';

import { Editor } from '../../editor/editor';

export const Tasks: React.FC = () => {
  const editorWrapper = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const { todos } = use(TodoContext);

  useEffect(() => {
    if (editorWrapper.current && !editorInstance) {
      setEditorInstance(
        new Editor({
          holder: editorWrapper.current,
          onReady: () => {
            console.log('Editor is ready');
          },
          onFailure: (error) => {
            console.error('Editor failed to initialize', error);
          },
        })
      );
    }
  }, [editorWrapper]);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div id="editor-wrapper" ref={editorWrapper} />
    </main>
  );
};

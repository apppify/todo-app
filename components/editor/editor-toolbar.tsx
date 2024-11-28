import React from 'react';

import { Bold, Code, Heading1, Heading2, Italic, List, Quote } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const EditorToolbar = () => {
  return (
    <div className="mb-4 flex gap-2 border-b pb-2">
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown('bold')} className="p-2">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown('italic')} className="p-2">
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const selection = window.getSelection();
          const blockElement = selection.anchorNode.parentElement;
          const blockId = parseInt(blockElement.getAttribute('data-id'));
          if (blockId) {
            handleBlockChange(blockId, '# ' + blockElement.innerText);
          }
        }}
        className="p-2"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const selection = window.getSelection();
          const blockElement = selection.anchorNode.parentElement;
          const blockId = parseInt(blockElement.getAttribute('data-id'));
          if (blockId) {
            handleBlockChange(blockId, '## ' + blockElement.innerText);
          }
        }}
        className="p-2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const selection = window.getSelection();
          const blockElement = selection.anchorNode.parentElement;
          const blockId = parseInt(blockElement.getAttribute('data-id'));
          if (blockId) {
            handleBlockChange(blockId, '- ' + blockElement.innerText);
          }
        }}
        className="p-2"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const selection = window.getSelection();
          const blockElement = selection.anchorNode.parentElement;
          const blockId = parseInt(blockElement.getAttribute('data-id'));
          if (blockId) {
            handleBlockChange(blockId, '> ' + blockElement.innerText);
          }
        }}
        className="p-2"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown('code')} className="p-2">
        <Code className="h-4 w-4" />
      </Button>
    </div>
  );
};

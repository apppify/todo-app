import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Card } from '@/components/ui/card';

type Block = {
  id: number;
  content: string;
  type: string;
  editing: boolean;
}

const initialBlocks = [
  { id: 1, content: 'Welcome to the editor', type: 'p', editing: false }
]

function reducer(state: Block[], action: { action: 'UPDATE_SINGLE_BLOCK' | 'ADD_NEW_BLOCK_AFTER', data: any }) {
  if (action.action === 'UPDATE_SINGLE_BLOCK') {
    const { id, content, type } = action.data;
    const newState = state.map(block => {
      if (block.id === id) {
        return { ...block, content, type };
      }
      return block;
    });

    return [...newState];
  }

  if (action.action === 'ADD_NEW_BLOCK_AFTER') {
    const { id, afterId, content, type } = action.data;
    const newState = [...state];
    const newBlock = {
      id,
      content,
      type,
      editing: true
    };
    newState.splice(state.findIndex(block => block.id === afterId) + 1, 0, newBlock);
    return newState;
  }

  return state;
}

export const InlineMarkdownEditor: React.FC = () => {
  const [blocks, dispatch] = useReducer(reducer, initialBlocks);
  // const blocksRef = useRef(initialBlocks); //! use useRef to prevent re-rendering 

  const focusBlock = (id: number) => {
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      if (blockElement) {
        blockElement.focus();
      }
    }, 10);
  }

  const handleBlockChange = (id: number, contentHtml: string, selectionStart: number | null = null) => {
    // .replaceAll(/&nbsp;/g, ' ')
    for (const block of blocks) {
      if (block.id !== id) continue;
      let typeChanged = false;
      let newContent = contentHtml;
      let newType = block.type;

      // Handle Markdown syntax
      if (contentHtml.startsWith('# ')) {
        newType = 'h1';
        newContent = contentHtml.slice(2);
        typeChanged = true;
      } else if (contentHtml.startsWith('## ')) {
        newType = 'h2';
        newContent = contentHtml.slice(3);
        typeChanged = true;
      } else if (contentHtml.startsWith('- ')) {
        newType = 'li';
        newContent = contentHtml.slice(2);
        typeChanged = true;
      } else if (contentHtml.startsWith('> ')) {
        newType = 'blockquote';
        newContent = contentHtml.slice(2);
        typeChanged = true;
      } else if (contentHtml.startsWith('```')) {
        newType = 'code';
        newContent = contentHtml.slice(3);
        typeChanged = true;
      }

      // Handle inline formatting
      let formattedContent = newContent;
      const formats = [
        { regex: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
        { regex: /_(.*?)_/g, replacement: '<em>$1</em>' },
        { regex: /`(.*?)`/g, replacement: '<code>$1</code>' }
      ];

      formats.forEach(({ regex, replacement }) => {
        formattedContent = formattedContent.replace(regex, replacement);
      });

      dispatch({ action: 'UPDATE_SINGLE_BLOCK', data: { id, content: formattedContent, type: newType } });

      if (typeChanged) {
        focusBlock(id);
      }

      // Set cursor position after formatting
      // if (selectionStart !== null) {
      //   setTimeout(() => {
      //     const element = document.querySelector(`[data-id="${id}"]`);
      //     if (element) {
      //       const range = document.createRange();
      //       const sel = window.getSelection();

      //       // Find the text node
      //       let textNode = null;
      //       for (const node of element.childNodes) {
      //         if (node.nodeType === Node.TEXT_NODE) {
      //           textNode = node;
      //           break;
      //         }
      //       }

      //       if (textNode) {
      //         const newPosition = Math.min(selectionStart + cursorOffset, textNode.length);
      //         range.setStart(textNode, newPosition);
      //         range.setEnd(textNode, newPosition);
      //         sel.removeAllRanges();
      //         sel.addRange(range);
      //       }
      //     }
      //   }, 0);
      // }

    };
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const newBlockId = Date.now();
      dispatch({ action: 'ADD_NEW_BLOCK_AFTER', data: { id: newBlockId, afterId: id, content: '', type: 'p' } });
      focusBlock(newBlockId);

    } else if (e.key === 'Backspace' && (e.target as HTMLElement).innerText === '' && blocks.length > 1) {
      // e.preventDefault();
      // setBlocks(blocks.filter(block => block.id !== id));

      // const prevBlock = document.querySelector(`[data-id="${blocks[index - 1]?.id}"]`) as HTMLElement;
      // if (prevBlock) {
      //   prevBlock.focus();
      //   // Place cursor at the end of the previous block
      //   const range = document.createRange();
      //   range.selectNodeContents(prevBlock);
      //   range.collapse(false);
      //   const selection = window.getSelection();
      //   if (selection) {
      //     selection.removeAllRanges();
      //     selection.addRange(range);
      //   }
      // }
    }
  };

  // const insertMarkdown = (tag: string) => {
  //   const selection = window.getSelection();
  //   const range = selection.getRangeAt(0);
  //   const blockElement = range.startContainer.parentElement;
  //   const blockId = parseInt(blockElement.getAttribute('data-id'));

  //   if (!blockId) return;

  //   const block = blocks.find(b => b.id === blockId);
  //   if (!block) return;

  //   const start = range.startOffset;
  //   const end = range.endOffset;
  //   const content = blockElement.innerText;

  //   const markdownTags = {
  //     bold: ['**', '**'],
  //     italic: ['_', '_'],
  //     code: ['`', '`']
  //   };

  //   const selectedText = content.substring(start, end);
  //   const [openTag, closeTag] = markdownTags[tag];
  //   const newContent = content.substring(0, start) + openTag + selectedText + closeTag + content.substring(end);

  //   handleBlockChange(blockId, newContent, start + openTag.length + selectedText.length + closeTag.length);
  // };

  const renderBlock = (block: Block, index: number) => {
    const commonProps = {
      'data-id': block.id,
      contentEditable: true,
      onInput: (e: any) => {
        const selection = window.getSelection();
        const cursorPosition = selection?.anchorOffset;
        if (cursorPosition) {
          handleBlockChange(block.id, e.target.innerHTML, cursorPosition);
        }
      },
      onKeyDown: (e: any) => handleKeyDown(e, block.id, index),
      dangerouslySetInnerHTML: { __html: block.content },
      className: 'outline-none px-4 py-1 min-h-[1.5em] focus:bg-gray-50 rounded'
    };

    switch (block.type) {
      case 'h1':
        return <h1 key={block.id} {...commonProps} className="outline-none text-3xl font-bold mb-3 focus:bg-gray-50" />;
      case 'h2':
        return <h2 key={block.id} {...commonProps} className="outline-none text-2xl font-bold mb-2 focus:bg-gray-50" />;
      case 'li':
        return (
          <div key={block.id} className="flex items-start px-4">
            <span className="mr-2 mt-1">•</span>
            <div {...commonProps} className="flex-1 outline-none py-1 min-h-[1.5em] focus:bg-gray-50 rounded" />
          </div>
        );
      case 'blockquote':
        return (
          <blockquote key={block.id} {...commonProps}
            className="border-l-4 border-gray-300 pl-4 italic my-2 outline-none py-1 min-h-[1.5em] focus:bg-gray-50 rounded"
          />
        );
      case 'code':
        return (
          <pre key={block.id} {...commonProps}
            className="bg-gray-100 font-mono p-2 rounded my-2 outline-none min-h-[1.5em] focus:bg-gray-200"
          />
        );
      default:
        return <p key={block.id} {...commonProps} />;
    }
  };

  console.log('rendering')

  return (
    <Card className="w-full max-w-3xl mx-auto p-4">
      <div className="min-h-[500px] focus:outline-none">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </Card>
  );
};
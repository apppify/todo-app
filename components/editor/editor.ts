import { Block } from './block';
import { EditorCore } from './core';

type OutputData = {
  blocks: Block[];
  timestamp: number;
};

export type EditorConfig = {
  holder: HTMLElement;
  isReadOnly: boolean;
  data: OutputData;
  onReady: () => void;
  onFailure: (error: Error) => void;
};

const defaultData: OutputData = {
  blocks: [
    {
      id: '1',
      type: 'paragraph',
      content: 'Hello World',
    },
  ],
  timestamp: Date.now(),
};

export class Editor {
  constructor(options?: Partial<EditorConfig>) {
    const config = this.statructConfiguration(options);
    const editor = new EditorCore(config);
  }

  private statructConfiguration(config?: Partial<EditorConfig>) {
    const tmp = document.createElement('div');

    const onReady = () => console.log('Editor is ready');
    const onFailure = (error: Error) => console.error('Editor failed to initialize', error);

    return {
      isReadOnly: config?.isReadOnly ?? false,
      data: config?.data ?? defaultData,
      holder: config?.holder ?? tmp,
      onReady: config?.onReady ?? onReady,
      onFailure: config?.onFailure ?? onFailure,
    } satisfies EditorConfig;
  }
}

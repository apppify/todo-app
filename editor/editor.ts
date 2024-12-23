import { BlockJson } from './block';
import { ModuleManager } from './module-manager';

type OutputData = {
  blocks: BlockJson[];
  timestamp: number;
};

export type EditorConfig = {
  holder: HTMLElement;
  isReadOnly: boolean;
  data?: OutputData | null;
  onReady: () => void;
  onFailure: (error: Error) => void;
};

export class Editor {
  constructor(options?: Partial<EditorConfig>) {
    const config = this.statructConfiguration(options);
    const editor = new ModuleManager(config);
  }

  private statructConfiguration(config?: Partial<EditorConfig>) {
    const tmp = document.createElement('div');

    const onReady = () => console.log('Editor is ready');
    const onFailure = (error: Error) => console.error('Editor failed to initialize', error);

    return {
      isReadOnly: config?.isReadOnly ?? false,
      data: config?.data,
      holder: config?.holder ?? tmp,
      onReady: config?.onReady ?? onReady,
      onFailure: config?.onFailure ?? onFailure,
    } satisfies EditorConfig;
  }
}

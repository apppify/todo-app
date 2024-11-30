import { ModuleName } from '.';
import { Block } from '../block';
import BaseModule from './base';
import BlockManager from './block-manager';
import LoggerModule from './logger';

export default class RenderModule extends BaseModule {
  static dependencies: ModuleName[] = ['LoggerModule', 'BlockManager'];
  private logger!: LoggerModule;
  private blockManager!: BlockManager;

  async initialize() {
    this.logger = this.getDependencies<LoggerModule>('LoggerModule');
    this.blockManager = this.getDependencies<BlockManager>('BlockManager');

    this.logger.log('🟢 Render module initialized');
  }

  async render(blocksData: Block[]) {
    return new Promise((resolve) => {
      this.blockManager;

      resolve(blocksData);
    });
  }
}

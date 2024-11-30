import { ModuleName } from '.';
import { Block, BlockJson } from '../block';
import BlockManager from '../block-manager';
import BaseModule from './base';
import LoggerModule from './logger';
import UIModule from './ui';

export default class RenderModule extends BaseModule {
  static dependencies: ModuleName[] = ['LoggerModule', 'UIModule'];
  private logger!: LoggerModule;
  private blockManager!: BlockManager;
  private ui!: UIModule;

  async initialize() {
    this.logger = this.getDependencies<LoggerModule>('LoggerModule');
    this.ui = this.getDependencies<UIModule>('UIModule');
    this.blockManager = new BlockManager(this.ui.wrapper);

    this.logger.log('🟢 Render module initialized');
  }

  async render(blocksData: BlockJson[]) {
    return new Promise((resolve) => {
      const data = this.config.data;

      if (!data || !data.blocks || data.blocks.length === 0) {
        this.blockManager.insert();
      } else {
        const blocks = data.blocks.map((blockData) => {
          return this.blockManager.composeBlock(blockData);
        });

        this.blockManager.insertMany(blocks);
      }

      resolve(blocksData);
    });
  }
}

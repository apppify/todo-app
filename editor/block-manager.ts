import { Block, BlockJson } from './block';

type InsertBlockOptions = Partial<BlockJson> & {
  index?: number;
  needToFocus?: boolean;
};

export default class BlockManager {
  private blocks: Block[] = [];
  private workingArea: HTMLElement;

  constructor(workingArea: HTMLElement) {
    this.workingArea = workingArea;
  }

  insert(blockData?: InsertBlockOptions) {
    const block = this.composeBlock(blockData);
    this.workingArea.appendChild(block.holder);
  }

  composeBlock(blockData?: InsertBlockOptions) {
    return new Block(blockData);
  }

  insertMany(blocks: Block[], index = 0) {
    const fragment = document.createDocumentFragment();

    for (const block of blocks) {
      fragment.appendChild(block.holder);
    }

    if (this.blocks.length > 0) {
      this.blocks.splice(index, 0, ...blocks);
      this.workingArea.insertBefore(fragment, this.blocks[index].holder);
    } else {
      this.blocks.push(...blocks);
      this.workingArea.appendChild(fragment);
    }
  }
}

export type BlockType = 'paragraph' | 'header' | 'list' | 'code' | 'quote';

export interface IBlock {
  id: string;
  type: BlockType;
  content: string;
}

export class Block {
  constructor() {}
}

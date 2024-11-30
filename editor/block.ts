import Paragraph from './elements/paragraph';
import * as _ from './utils';

export type BlockType = 'paragraph' | 'header' | 'list' | 'code' | 'quote';

export interface BlockJson {
  id: string;
  type: BlockType;
  content: string;
}

export class Block implements BlockJson {
  id: string;
  type: BlockType;
  content: string;

  readonly holder: HTMLElement;

  public static get CSS(): { [name: string]: string } {
    return {
      wrapper: 'ce-block',
      wrapperStretched: 'ce-block--stretched',
      content: 'ce-block__content',
      selected: 'ce-block--selected',
      dropTarget: 'ce-block--drop-target',
    };
  }

  constructor(block: Partial<BlockJson> = {}) {
    this.id = block.id ?? _.generateBlockId();
    this.type = block.type ?? 'paragraph';
    this.content = block.content ?? '';
    this.holder = this.compose();
  }

  private compose() {
    const wrapper = _.make('div', Block.CSS.wrapper);
    const content = _.make('div', Block.CSS.content);
    const element = this.renderElement();

    content.appendChild(element.render());
    wrapper.appendChild(content);
    wrapper.dataset.id = this.id;

    return wrapper;
  }

  private renderElement() {
    switch (this.type) {
      case 'paragraph':
        return new Paragraph({
          content: this.content,
        });
      default:
        return new Paragraph({
          content: this.content,
        });
    }
  }
}

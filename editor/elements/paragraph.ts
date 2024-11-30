import * as _ from '../utils';
import { BaseElement } from './base';

export default class Paragraph implements BaseElement {
  private data: any;
  private element: HTMLElement | null = null;

  constructor(data: any) {
    this.data = data;
  }

  render() {
    this.element = _.make('p');
    this.element.contentEditable = 'true';
    this.element.innerHTML = this.data.content;

    return this.element;
  }
}

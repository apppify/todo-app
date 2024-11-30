import { ModuleName } from '.';
import * as _ from '../utils';
import { make } from '../utils';
import BaseModule from './base';
import LoggerModule from './logger';

export default class UIModule extends BaseModule {
  static dependencies: ModuleName[] = ['LoggerModule'];
  private holder!: HTMLElement;
  public wrapper!: HTMLElement;
  private logger!: LoggerModule;

  async initialize() {
    this.logger = this.getDependencies<LoggerModule>('LoggerModule');

    this.make();

    this.logger.log('🟢 UI module initialized');
  }

  private make() {
    this.holder = this.config.holder;
    this.wrapper = make('div', 'editor-wrapper');

    // test
    this.wrapper.innerHTML = `
      <div class="editor-toolbar">test</div>
    `;

    this.holder.appendChild(this.wrapper);
  }
}

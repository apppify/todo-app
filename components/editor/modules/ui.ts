import Module, { BaseModule } from '../__module';
import { make } from '../utils';

interface UINodes {
  holder: HTMLElement;
  wrapper: HTMLElement;
}

export default class UI extends Module<UINodes> implements BaseModule {
  async prepare() {
    this.make();
  }

  private make() {
    this.nodes.holder = this.config.holder;
    this.nodes.wrapper = make('div', 'editor-wrapper');

    // test
    this.nodes.wrapper.innerHTML = `
      <div class="editor-toolbar">test</div>
    `;

    this.nodes.holder.appendChild(this.nodes.wrapper);
  }
}

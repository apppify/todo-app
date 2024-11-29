import { EditorConfig } from './editor';
import modules from './modules';

type ModuleName = keyof typeof modules;
type EditorModuleT = Record<ModuleName, any>;

export class EditorCore {
  public config;
  private moduleInstances: EditorModuleT = {} as EditorModuleT;

  constructor(config: EditorConfig) {
    this.config = config;

    let onReady = this.config.onReady;
    let onFailure = this.config.onFailure;

    Promise.resolve()
      .then(async () => {
        this.init();
        await this.start();

        onReady();
      })
      .catch((err) => {
        onFailure(err);
      });
  }

  private init() {
    this.constructModules();
  }

  private async start() {
    const modulesToPrepare: ModuleName[] = ['UI', 'Caret'];

    await modulesToPrepare.reduce((promise, moduleName) => {
      return promise.then(() => {
        return this.moduleInstances[moduleName as ModuleName].prepare();
      });
    }, Promise.resolve());
  }

  private constructModules() {
    Object.entries(modules).forEach(([moduleName, module]) => {
      try {
        this.moduleInstances[moduleName as ModuleName] = new module(this.config);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

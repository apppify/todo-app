import { EditorConfig } from '../editor';
import { ModuleManager } from '../module-manager';
import type { ModuleClassInstanceType, ModuleName } from './index';

export default abstract class BaseModule {
  static dependencies: ModuleName[] = [];
  protected config: EditorConfig;
  protected moduleManager: ModuleManager;
  protected dependencies: Map<ModuleName, ModuleClassInstanceType>;

  constructor(
    config: EditorConfig,
    moduleManager: ModuleManager,
    dependencies?: Map<ModuleName, any>
  ) {
    this.config = config;
    this.moduleManager = moduleManager;
    this.dependencies = dependencies ?? new Map();
  }

  abstract initialize(): Promise<void>;

  protected getDependencies<T extends ModuleClassInstanceType>(moduleName: ModuleName): T {
    const module = this.dependencies.get(moduleName);

    if (!module) {
      throw new Error(`Module ${moduleName} is not registered`);
    }

    return module as T;
  }
}

import { EditorConfig } from './editor';
import type { ModuleClassInstanceType, ModuleClassType, ModuleName } from './modules';
import modules from './modules';
import BaseModule from './modules/base';
import RenderModule from './modules/render';

type ModuleLoadQueue = { moduleClass: ModuleClassType; dependencies: ModuleName[] };

export class ModuleManager {
  public config;
  private modules: Map<ModuleName, ModuleClassInstanceType> = new Map();
  private moduleLoadQueue: Array<ModuleLoadQueue> = [];
  private loadingPromises: Map<ModuleName, Promise<BaseModule>> = new Map();

  constructor(config: EditorConfig) {
    this.config = config;

    this.init();
  }

  private async init() {
    this.registerModule();

    await this.loadModules();
    await this.startPrepare();

    await this.render();
  }

  private async registerModule() {
    Object.entries(modules).forEach(([_, module]) => {
      this.moduleLoadQueue.push({
        moduleClass: module,
        dependencies: module.dependencies ?? [],
      });
    });
  }

  private render() {
    const renderModule = this.modules.get('RenderModule') as RenderModule;
    return renderModule.render(this.config.data?.blocks ?? []);
  }

  private async startPrepare() {
    const modulesToPrepare: ModuleName[] = ['UIModule'];
    await modulesToPrepare.reduce((promise, moduleName) => {
      return promise.then(() => {
        if (this.modules.has(moduleName)) {
          const m = this.modules.get(moduleName)!;
          if ('prepare' in m && typeof m.prepare === 'function') {
            return m.prepare();
          }
        }
      });
    }, Promise.resolve());
  }

  private async loadModules() {
    const sortedModules = this.sortModules(this.moduleLoadQueue);

    for (const { moduleClass, dependencies } of sortedModules) {
      await this.loadModule(moduleClass);
    }
  }

  private sortModules(moduleQueue: Array<ModuleLoadQueue>) {
    const visited = new Set<ModuleName>();
    const sorted = new Array<ModuleLoadQueue>();

    const visit = (entry: ModuleLoadQueue) => {
      const moduleName = entry.moduleClass.name as ModuleName;

      if (visited.has(moduleName)) return;

      // Check dependencies first
      for (const depName of entry.dependencies) {
        const depEntry = moduleQueue.find((m) => m.moduleClass.name === depName);
        if (depEntry && !visited.has(depName)) {
          visit(depEntry);
        }
      }

      visited.add(moduleName);
      sorted.push(entry);
    };

    for (const entry of moduleQueue) {
      if (!visited.has(entry.moduleClass.name as ModuleName)) {
        visit(entry);
      }
    }

    return sorted;
  }

  private async loadModule(moduleClass: ModuleClassType): Promise<BaseModule> {
    const moduleName = moduleClass.name as ModuleName;

    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName)!;
    }

    const loadingPromise = (async () => {
      const dependencies = await this.loadDependencies(moduleClass);

      const moduleInstance = new moduleClass(this.config, this, dependencies);

      await moduleInstance.initialize();

      this.modules.set(moduleName, moduleInstance);

      return moduleInstance;
    })();

    this.loadingPromises.set(moduleName, loadingPromise);

    return loadingPromise;
  }

  private async loadDependencies(
    moduleClass: ModuleClassType
  ): Promise<Map<ModuleName, ModuleClassInstanceType>> {
    const dependencyMap = new Map<ModuleName, ModuleClassInstanceType>();

    const requiredDeps = moduleClass.dependencies ?? [];
    for (const depName of requiredDeps) {
      if (!this.modules.has(depName)) {
        const depModuleClass = this.findModuleClassByName(depName);
        if (!depModuleClass) {
          throw new Error(`Module ${depName} is not registered`);
        }

        await this.loadModule(depModuleClass);
      }

      dependencyMap.set(depName, this.modules.get(depName)!);
    }

    return dependencyMap;
  }

  private findModuleClassByName(depName: ModuleName): ModuleClassType | undefined {
    return this.moduleLoadQueue
      .map((entry) => entry.moduleClass)
      .find((moduleClass) => moduleClass.name === depName);
  }
}

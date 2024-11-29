import { object } from 'zod';

import { EditorConfig } from './editor';

type ModuleNodes = object;

export interface BaseModule {
  prepare(): Promise<void>;
}

export default class Module<T extends ModuleNodes = Record<string, HTMLElement>> {
  protected nodes: T = {} as T;
  protected config: EditorConfig;

  constructor(config: EditorConfig) {
    this.config = config;
  }
}

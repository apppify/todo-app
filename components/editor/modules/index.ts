import BlockManager from './block-manager';
import Caret from './caret';
import LoggerModule from './logger';
import RenderModule from './renderer';
import UIModule from './ui';

const modules = {
  LoggerModule,
  UIModule,
  Caret,
  RenderModule,
  BlockManager,
};

export default modules;
export type ModuleName = keyof typeof modules;
export type ModuleClassType = (typeof modules)[ModuleName];
export type ModuleClassMap = typeof modules;
export type ModuleClassInstanceType = InstanceType<(typeof modules)[ModuleName]>;

import { type Disposables } from './getDisposables';

export interface DocumentContext<Options extends Record<string, any> = any> {
  document: Document;
  disposables: Disposables;
  options?: Options;
}

export interface ScrollLockStep<Options extends Record<string, any> = any> {
  before?(ctx: DocumentContext<Options>): void;
  after?(ctx: DocumentContext<Options>): void;
}

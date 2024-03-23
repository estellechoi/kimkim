import addMicroTask from './addMicroTask';

export type Disposables = ReturnType<typeof getDisposables>;

export function getDisposables() {
  let _disposables: Function[] = [];

  const api = {
    addEventListener<TEventName extends keyof WindowEventMap>(
      element: HTMLElement | Window | Document,
      name: TEventName,
      listener: (event: WindowEventMap[TEventName]) => any,
      options?: boolean | AddEventListenerOptions
    ) {
      element.addEventListener(name, listener as any, options);
      return api.add(() => element.removeEventListener(name, listener as any, options));
    },

    requestAnimationFrame(...args: Parameters<typeof requestAnimationFrame>) {
      let raf = requestAnimationFrame(...args);
      return api.add(() => cancelAnimationFrame(raf));
    },

    nextFrame(...args: Parameters<typeof requestAnimationFrame>) {
      return api.requestAnimationFrame(() => {
        return api.requestAnimationFrame(...args);
      });
    },

    setTimeout(...args: Parameters<typeof setTimeout>) {
      let timer = setTimeout(...args);
      return api.add(() => clearTimeout(timer));
    },

    microTask(...args: Parameters<typeof addMicroTask>) {
      let task = { current: true };
      addMicroTask(() => {
        if (task.current) {
          args[0]();
        }
      });
      return api.add(() => {
        task.current = false;
      });
    },

    style(node: HTMLElement, property: string, value: string) {
      let previous = node.style.getPropertyValue(property);
      Object.assign(node.style, { [property]: value });
      return this.add(() => {
        Object.assign(node.style, { [property]: previous });
      });
    },

    // group(callback: (d: typeof this) => void) {
    //   let d = disposables();
    //   callback(d);
    //   return this.add(() => d.dispose());
    // },

    add(callback: () => void) {
      _disposables.push(callback);
      return () => {
        let idx = _disposables.indexOf(callback);
        if (idx >= 0) {
          for (let dispose of _disposables.splice(idx, 1)) {
            dispose();
          }
        }
      };
    },

    dispose() {
      for (let dispose of _disposables.splice(0)) {
        dispose();
      }
    },
  };

  return api;
}

/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask
 */
const addMicroTask = (callback: () => void) => {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback);
  } else {
    // polyfill
    Promise.resolve()
      .then(callback)
      .catch((e) =>
        setTimeout(() => {
          throw e;
        })
      );
  }
};

export default addMicroTask;

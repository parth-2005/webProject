/**
 * Wrap an async Express handler and forward errors to `next`.
 * @param {(req: any, res: any, next: any) => Promise<any>} fn
 * @returns {(req: any, res: any, next: any) => void}
 */
export function asyncHandler(fn) {
  return function wrappedAsyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}


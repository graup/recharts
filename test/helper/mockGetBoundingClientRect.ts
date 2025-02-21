const original = Element.prototype.getBoundingClientRect;

/**
 * getBoundingClientRect always returns 0 in jsdom, we can't test for actual returned string size
 * Execution order matters
 * https://github.com/jsdom/jsdom/issues/1590#issuecomment-578350151
 *
 * @param rect overrides getBoundingClientRect return value in the mock. jsdom by design returns all zeroes
 * @returns cleanup function, convenient for beforeAll or beforeEach
 */
export function mockGetBoundingClientRect(rect: Partial<DOMRect>) {
  const mockDomRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...rect,
  };
  Element.prototype.getBoundingClientRect = () => ({
    ...mockDomRect,
    toJSON: () => JSON.stringify(mockDomRect),
  });
  return function cleanup() {
    Element.prototype.getBoundingClientRect = original;
  };
}

export function restoreGetBoundingClientRect() {
  Element.prototype.getBoundingClientRect = original;
}

import { memoize } from './memoize';

describe('memoize', () => {
  it('should work', () => {
    expect(memoize()).toEqual('memoize');
  });
});

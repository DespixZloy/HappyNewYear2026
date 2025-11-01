import { describe, it, expect } from '@jest/globals';

describe('App', () => {
  it('should pass basic math', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    expect('hello').toBe('hello');
  });

  it('should work with arrays', () => {
    expect([1, 2, 3]).toHaveLength(3);
  });
});
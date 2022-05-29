import { testCase } from './auth.controllers.js';

describe('Auth Test', () => {
  it('Demo function 1', () => {
    expect(testCase(1, 'lets go')).toBeTruthy();
  });

  it('Demo function 2', () => {
    expect(testCase('lets go', 'lets go')).toBeFalsy();
  });

  it('Demo function 3', () => {
    expect(testCase(1, 2)).toBeFalsy();
  });
});

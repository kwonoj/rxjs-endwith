import { expect } from 'chai';
import * as idx from '../src/index';

describe('index', () => {
  it('should export operator', () => {
    expect(idx.endWith).to.be.a('function');
  });
});

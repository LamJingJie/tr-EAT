import { CountItemsCartPipe } from './count-items-cart.pipe';

describe('CountItemsCartPipe', () => {
  it('create an instance', () => {
    const pipe = new CountItemsCartPipe();
    expect(pipe).toBeTruthy();
  });
});

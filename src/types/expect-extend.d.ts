export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeIllust(): R;
      toBeIllustArray(): R;
      toBeTagArray(): R;
    }
  }
}

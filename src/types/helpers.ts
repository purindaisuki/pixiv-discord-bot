export const makeTuple = <A extends any, B extends any>([a, b]: [A, B]): [
  A,
  B
] => [a, b];

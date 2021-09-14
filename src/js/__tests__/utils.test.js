import { calcTileType } from '../utils';

test('render top-left', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('render top', () => {
  expect(calcTileType(1, 8)).toBe('top');
});

test('render top-right', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});

test('render left', () => {
  expect(calcTileType(8, 8)).toBe('left');
});

test('render right', () => {
  expect(calcTileType(15, 8)).toBe('right');
});

test('render bottom-left', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('render bottom', () => {
  expect(calcTileType(57, 8)).toBe('bottom');
});

test('render bottom-right', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});

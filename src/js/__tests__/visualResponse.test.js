import GamePlay from '../GamePlay';
import cursors from '../cursors';

jest.mock('../GamePlay');
beforeEach(() => jest.resetAllMocks());

test('should cursors -> pointer', () => {
  const gamePlay = new GamePlay();
  gamePlay.setCursor.mockReturnValue('pointer');

  expect(gamePlay.setCursor(cursors.pointer)).toEqual('pointer');
});

test('should cell -> green', () => {
  const gamePlay = new GamePlay();
  gamePlay.selectCell.mockReturnValue('green');

  expect(gamePlay.selectCell(8, 'green')).toEqual('green');
});

test('should cell -> red, cursor -> crosshair', () => {
  const gamePlay = new GamePlay();
  gamePlay.setCursor.mockReturnValue('crosshair');
  gamePlay.selectCell.mockReturnValue('red');

  expect(gamePlay.setCursor(cursors.crosshair)).toEqual('crosshair');
  expect(gamePlay.selectCell(8, 'red')).toEqual('red');
});

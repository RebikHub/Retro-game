import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';

jest.mock('../GameStateService');
beforeEach(() => jest.resetAllMocks());

test('should throw error message', () => {
  const gameState = new GameStateService(localStorage);
  const err = gameState.load.mockReturnValue(Error);
//   gameState.load(GamePlay.showError(err));
  expect(GamePlay.showError(err)).toThrow('Invalid state');
});

// test('should throw error message', () => {
//   const gameState = new GameStateService(9);
//   expect(() => gameState.load()).toThrow('Invalid state');
// });

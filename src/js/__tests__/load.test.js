import GameStateService from '../GameStateService';
import GameController from '../GameController';
import GamePlay from '../GamePlay';

jest.mock('../GamePlay');
beforeEach(() => jest.resetAllMocks());

test('should throw error message', () => {
  const gameState = new GameStateService();
  const gameControl = new GameController(GamePlay, gameState);
  GamePlay.showError = jest.fn();
  gameControl.onLoadGameClick();
  expect(GamePlay.showError).toHaveBeenCalled();
});

test('should load state', () => {
  const gameState = new GameStateService(localStorage);
  GamePlay.showError = jest.fn();
  try {
    gameState.load();
  } catch (error) {
    GamePlay.showError(error);
  }
  expect(GamePlay.showError).not.toHaveBeenCalled();
});

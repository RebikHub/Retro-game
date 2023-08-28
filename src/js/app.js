/**
 * Entry point of app: don't change this
 */
import GamePlay from './classes/play/GamePlay';
import GameController from './classes/controller/GameController';
import GameStateService from './classes/state-service/GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here

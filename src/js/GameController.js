import themes from './themes';
import { generateTeam } from './generators';
import Swordsman from './classes/swordsman';
import Bowerman from './classes/bowerman';
import Magician from './classes/magician';
import Daemon from './classes/daemon';
import Vampire from './classes/vampire';
import Undead from './classes/undead';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.humanTeam = [Bowerman, Swordsman, Magician];
    this.aiTeam = [Daemon, Vampire, Undead];
    this.startPositionHuman = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.startPositionAi = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.level = 1;
    this.charCount = 2;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(GameController.startPositionChar(this.humanTeam, this.startPositionHuman));
    this.gamePlay.redrawPositions(GameController.startPositionChar(this.aiTeam, this.startPositionAi));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  static startPositionChar(charact, arrPos) {
    const arr = [];
    const char = generateTeam(charact, 1, 2);
    for (let i = 0; i < char.length; i += 1) {
      const humanPos = Math.floor(Math.random() * arrPos.length);
      arr.push(new PositionedCharacter(char[i], humanPos));
    }
    return arr;
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}

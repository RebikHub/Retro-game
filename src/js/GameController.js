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
    this.humanHeroes = [Bowerman, Swordsman, Magician];
    this.aiHeroes = [Daemon, Vampire, Undead];
    this.startPositionHuman = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.startPositionAi = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.startPosition = [];
    this.humanTeam = [];
    this.aiTeam = [];
    this.level = 1;
    this.charCount = 2;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    GameController.generateHeroes(this.aiHeroes, this.aiTeam, this.humanHeroes, this.humanTeam);
    // eslint-disable-next-line max-len
    GameController.startPositionChar(this.humanTeam, this.startPositionHuman, this.aiTeam, this.startPositionAi, this.startPosition);
    this.gamePlay.redrawPositions(this.startPosition);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  static startPositionChar(humanTeam, posHuman, aiTeam, posAi, arr) {
    let comparePos;
    for (let i = 0; i < humanTeam.length; i += 1) {
      let humanPos = posHuman[Math.floor(Math.random() * posHuman.length)];
      while (comparePos === humanPos) {
        humanPos = posHuman[Math.floor(Math.random() * posHuman.length)];
      }
      comparePos = humanPos;
      arr.push(new PositionedCharacter(humanTeam[i], humanPos));
    }
    for (let i = 0; i < aiTeam.length; i += 1) {
      let aiPos = posAi[Math.floor(Math.random() * posAi.length)];
      while (comparePos === aiPos) {
        aiPos = posAi[Math.floor(Math.random() * posAi.length)];
      }
      comparePos = aiPos;
      arr.push(new PositionedCharacter(aiTeam[i], aiPos));
    }
    return arr;
  }

  static generateHeroes(aiHeroes, aiTeam, humanHeroes, humanTeam) {
    const aiChar = generateTeam(aiHeroes, 1, 2);
    for (let i = 0; i < aiChar.length; i += 1) {
      aiTeam.push(aiChar[i]);
    }
    const humanChar = generateTeam(humanHeroes, 1, 2);
    for (let i = 0; i < humanChar.length; i += 1) {
      humanTeam.push(humanChar[i]);
    }
  }

  onCellClick(index) {
    const cellClick = this.gamePlay.cells[index];
    console.log(cellClick);
  }

  onCellEnter(index) {
    const cellEnter = this.gamePlay.cells[index];
    const medal = '\u{1F396}';
    const swords = '\u{2694}';
    const shield = '\u{1F6E1}';
    const heart = '\u{2764}';
    let message = '';
    for (let i = 0; i < this.humanTeam.length; i += 1) {
      if (this.humanTeam[i].type === cellEnter.children[0].classList[1]) {
        const health = cellEnter.children[0].children[0].children[0].style.width;
        message = `${medal} ${this.humanTeam[i].level} ${swords} ${this.humanTeam[i].attack} ${shield} ${this.humanTeam[i].defence} ${heart} ${health}`;
      }
    }
    for (let i = 0; i < this.aiTeam.length; i += 1) {
      if (this.aiTeam[i].type === cellEnter.children[0].classList[1]) {
        const health = cellEnter.children[0].children[0].children[0].style.width;
        message = `${medal} ${this.aiTeam[i].level} ${swords} ${this.aiTeam[i].attack} ${shield} ${this.aiTeam[i].defence} ${heart} ${health}`;
      }
    }
    if (cellEnter.children[0]) {
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    const cellLeave = this.gamePlay.cells[index];
    if (cellLeave.children[0]) {
      this.gamePlay.hideCellToolTip(index);
    }
  }
}

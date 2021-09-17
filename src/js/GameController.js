import themes from './themes';
import { generateTeam } from './generators';
import Swordsman from './classes/swordsman';
import Bowerman from './classes/bowerman';
import Magician from './classes/magician';
import Daemon from './classes/daemon';
import Vampire from './classes/vampire';
import Undead from './classes/undead';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';

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
    this.selectHero = 1;
    this.stateHero = {};
    this.stateHeroMove = 0;
    this.stateHeroAttack = 0;
    this.moveHero = [];
    this.attackHero = [];
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
    for (let i = 0; i < this.humanTeam.length; i += 1) {
      if (this.humanTeam[i].type === cellClick.children[0].classList[1]) {
        this.gamePlay.deselectCell(this.selectHero);
        this.selectHero = index;
        this.gamePlay.selectCell(index);
        this.stateHero = GameState.from(this.humanTeam[i]);// next round logic!!!
        this.stateHeroMove = GameController.moveCharacter(this.stateHero);
        this.moveHero = GameController.cellsMove(this.stateHeroMove, index);
        this.stateHeroAttack = GameController.attackCharacter(this.stateHero);
        this.attackHero = GameController.cellsMove(this.stateHeroAttack, index);
      }
    }
    for (let i = 0; i < this.aiTeam.length; i += 1) {
      if (this.aiTeam[i].type === cellClick.children[0].classList[1]) {
        GamePlay.showError('Not you hero!!!');
      }
    }
  }

  onCellEnter(index) {
    if (this.moveHero.includes(index)) {
      this.gamePlay.selectCell(index, 'green');
    }
    const cellEnter = this.gamePlay.cells[index];
    const medal = '\u{1F396}';
    const swords = '\u{2694}';
    const shield = '\u{1F6E1}';
    const heart = '\u{2764}';
    let message = '';
    for (let i = 0; i < this.humanTeam.length; i += 1) {
      if (this.humanTeam[i].type === cellEnter.children[0].classList[1]) {
        const health = cellEnter.querySelector('.health-level-indicator').style.width;
        message = `${medal} ${this.humanTeam[i].level} ${swords} ${this.humanTeam[i].attack} ${shield} ${this.humanTeam[i].defence} ${heart} ${health}`;
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
    for (let i = 0; i < this.aiTeam.length; i += 1) {
      if (this.aiTeam[i].type === cellEnter.children[0].classList[1]) {
        const health = cellEnter.querySelector('.health-level-indicator').style.width;
        message = `${medal} ${this.aiTeam[i].level} ${swords} ${this.aiTeam[i].attack} ${shield} ${this.aiTeam[i].defence} ${heart} ${health}`;
        if (this.stateHero && this.attackHero.includes(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
    if (cellEnter.children[0]) {
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    const cellLeave = this.gamePlay.cells[index];
    if (index !== this.selectHero) {
      this.gamePlay.deselectCell(index);
    }
    for (let i = 0; i < this.aiTeam.length; i += 1) {
      if (this.aiTeam[i].type === cellLeave.children[0].classList[1]) {
        this.gamePlay.deselectCell(index, 'red');
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
    if (cellLeave.children[0]) {
      this.gamePlay.hideCellToolTip(index);
    }
  }

  static moveCharacter(character) {
    if (character.type === 'bowman' || character.type === 'vampire') {
      return 3;
    } if (character.type === 'swordsman' || character.type === 'undead') {
      return 5;
    } if (character.type === 'magician' || character.type === 'daemon') {
      return 2;
    }
    return 'error not character!';
  }

  static attackCharacter(character) {
    if (character.type === 'bowman' || character.type === 'vampire') {
      return 3;
    } if (character.type === 'swordsman' || character.type === 'undead') {
      return 2;
    } if (character.type === 'magician' || character.type === 'daemon') {
      return 5;
    }
    return 'error not character!';
  }

  static cellsMove(char, index) {
    const arr = [];
    const arrHor = [];
    const arrSize = 8;
    let numArr = 0;
    for (let i = 0; i < 64; i += 1) {
      arr.push(i);
    }
    for (let i = 0; i < arr.length; i += arrSize) {
      arrHor.push(arr.slice(i, i + arrSize));
    }
    for (let i = 0; i < arrHor.length; i += 1) {
      if (arrHor[i].includes(index)) numArr = i;
    }
    const horizont = 1;
    const vertical = 8;
    const move = [];
    let moveHorR = index;
    for (let i = 1; i < char; i += 1) {
      moveHorR += horizont;
      if (arrHor[numArr].includes(moveHorR)) move.push(moveHorR);
    }
    let moveHorL = index;
    for (let i = 1; i < char; i += 1) {
      moveHorL -= horizont;
      if (arrHor[numArr].includes(moveHorL)) move.push(moveHorL);
    }

    let moveVertU = index;
    for (let i = 1; i < char; i += 1) {
      moveVertU += vertical;
      if (arr.includes(moveVertU)) move.push(moveVertU);
      let num = 0;
      for (let j = 0; j < arrHor.length; j += 1) {
        if (arrHor[j].includes(moveVertU)) num = j;
      }
      const diagU = moveVertU + horizont * i;
      if (arrHor[num].includes(diagU)) move.push(diagU);
      const diagD = moveVertU - horizont * i;
      if (arrHor[num].includes(diagD)) move.push(diagD);
    }
    let moveVertD = index;
    for (let i = 1; i < char; i += 1) {
      moveVertD -= vertical;
      if (arr.includes(moveVertD)) move.push(moveVertD);
      let num = 0;
      for (let j = 0; j < arrHor.length; j += 1) {
        if (arrHor[j].includes(moveVertD)) num = j;
      }
      const diagU = moveVertD + horizont * i;
      if (arrHor[num].includes(diagU)) move.push(diagU);
      const diagD = moveVertD - horizont * i;
      if (arrHor[num].includes(diagD)) move.push(diagD);
    }
    return move;
  }
}

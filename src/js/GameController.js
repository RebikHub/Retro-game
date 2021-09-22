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
    this.startPosHum = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.startPosAi = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.startPosition = [];
    this.humanTeam = [];
    this.aiTeam = [];
    this.level = 1;
    this.charCount = 2;
    this.selectHero = 0;
    this.stateHero = {};
    this.moveHero = [];
    this.attackHero = [];
    this.humDamage = 0;
    this.aiDamage = 0;
    this.gameState = [];
    this.theme = '';
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.generateHumHeroes(this.humanHeroes, this.level, this.charCount);
    this.generateAiHeroes(this.aiHeroes, this.level, this.charCount);
    this.startPositionChar(this.humanTeam, this.startPosHum, this.aiTeam, this.startPosAi);
    this.gamePlay.redrawPositions(this.startPosition);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  startPositionChar(humanTeam, posHuman, aiTeam, posAi) {
    let comparePos;

    for (let i = 0; i < humanTeam.length; i += 1) {
      let humanPos = posHuman[Math.floor(Math.random() * posHuman.length)];
      while (comparePos === humanPos) {
        humanPos = posHuman[Math.floor(Math.random() * posHuman.length)];
      }
      comparePos = humanPos;
      this.startPosition.push(new PositionedCharacter(humanTeam[i], humanPos));
    }
    for (let i = 0; i < aiTeam.length; i += 1) {
      let aiPos = posAi[Math.floor(Math.random() * posAi.length)];
      while (comparePos === aiPos) {
        aiPos = posAi[Math.floor(Math.random() * posAi.length)];
      }
      comparePos = aiPos;
      this.startPosition.push(new PositionedCharacter(aiTeam[i], aiPos));
    }
  }

  generateHumHeroes(humanHeroes, level, charCount) {
    const humanChar = generateTeam(humanHeroes, level, charCount);
    for (let i = 0; i < humanChar.length; i += 1) {
      this.humanTeam.push(humanChar[i]);
    }
  }

  generateAiHeroes(aiHeroes, level, charCount) {
    const aiChar = generateTeam(aiHeroes, level, charCount);
    for (let i = 0; i < aiChar.length; i += 1) {
      this.aiTeam.push(aiChar[i]);
    }
  }

  playMove(index, characterPosition) {
    if (this.stateHero && this.moveHero.includes(index)) {
      for (let i = 0; i < this.startPosition.length; i += 1) {
        if (characterPosition === this.startPosition[i].position) {
          this.startPosition[i].position = index;
        }
      }
      this.playTurn(index, this.startPosition);
      this.gamePlay.redrawPositions(this.startPosition);
    }
  }

  async playAttack(index, character, cell) {
    const cellDom = cell;
    if (['daemon', 'vampire', 'undead'].includes(cell.children[0].classList[1])) {
      for (let i = 0; i < this.startPosition.length; i += 1) {
        if (index === this.startPosition[i].position) {
          const target = this.startPosition[i].character;
          const diff = character.attack - target.defence;
          let odd = 0;
          if (diff <= 0 && diff > (-15)) {
            odd = 0.6;
          } else if (diff <= (-15) && diff > (-30)) {
            odd = 0.4;
          } else if (diff <= (-30)) {
            odd = 0.2;
          }
          this.humDamage = Math.max(diff, character.attack * odd);
          target.health -= this.humDamage;
          cellDom.querySelector('.health-level-indicator').style.width = `${target.health}%`;
          if (target.health <= 0) {
            this.characterDeath(target.type, this.startPosition, index);
          }
        }
      }
    }
    await this.gamePlay.showDamage(index, this.humDamage);
    this.playTurn(index, this.startPosition);
  }

  getGameState(startPosition) {
    this.gameState = [];
    this.aiTeam = [];
    this.humanTeam = [];
    for (const iter of startPosition) {
      if (['daemon', 'vampire', 'undead'].includes(iter.character.type)) {
        this.gameState.push(GameState.from({
          character: iter.character,
          position: iter.position,
        }));
        iter.character.position = iter.position;
        this.aiTeam.push(iter.character);
      } else if (['magician', 'swordsman', 'bowman'].includes(iter.character.type)) {
        this.gameState.push(GameState.from({
          character: iter.character,
          position: iter.position,
        }));
        this.humanTeam.push(iter.character);
      }
    }
  }

  playTurn(index, startPosition) {
    this.getGameState(startPosition);
    const randAi = Math.floor(Math.random() * this.aiTeam.length);
    this.aiTurnLogic(this.aiTeam[randAi], this.aiTeam[randAi].position);
  }

  aiTurnLogic(char, charPos) {
    const radiusAttack = GameController.cellsAttack(char, charPos);
    let index = null;
    for (let i = 0; i < radiusAttack.length; i += 1) {
      if (this.gamePlay.cells[radiusAttack[i]].children[0] && ['magician', 'swordsman', 'bowman'].includes(this.gamePlay.cells[radiusAttack[i]].children[0].classList[1])) {
        index = radiusAttack[i];
      }
    }
    if (index !== null) {
      this.playAiAttack(index, this.startPosition, char);
    } else {
      this.playAiMove(char, charPos);
    }
  }

  playAiMove(char, charPos) {
    const radiusMove = GameController.cellsMove(char, charPos);
    const randomMove = Math.floor(Math.random() * radiusMove.length);
    if (!this.gamePlay.cells[radiusMove[randomMove]].children[0]) {
      for (let i = 0; i < this.startPosition.length; i += 1) {
        if (this.startPosition[i].position === charPos) {
          this.startPosition[i].position = radiusMove[randomMove];
        }
      }
    }
    this.gamePlay.redrawPositions(this.startPosition);
  }

  async playAiAttack(index, statePosition, character) {
    let targetPosition = null;

    for (let j = 0; j < statePosition.length; j += 1) {
      if (index === statePosition[j].position) {
        const target = statePosition[j].character;
        targetPosition = index;
        const diff = character.attack - target.defence;
        let odd = 0;
        if (diff <= 0 && diff > (-15)) {
          odd = 0.6;
        } else if (diff <= (-15) && diff > (-30)) {
          odd = 0.4;
        } else if (diff <= (-30)) {
          odd = 0.2;
        }
        this.aiDamage = Math.max(diff, character.attack * odd);
        target.health -= this.aiDamage;
        this.gamePlay.cells[index].querySelector('.health-level-indicator').style.width = `${target.health}%`;
        if (target.health <= 0) {
          this.characterDeath(target.type, this.startPosition, index);
        }
      }
    }
    await this.gamePlay.showDamage(targetPosition, this.aiDamage);
  }

  characterDeath(character, statePosition, index) {
    for (let i = 0; i < statePosition.length; i += 1) {
      if (character === statePosition[i].character.type && statePosition[i].position === index) {
        statePosition.splice(i, 1);
      }
    }
    this.getGameState(statePosition);
    this.gamePlay.deselectCell(this.selectHero);
    this.selectHero = 0;
    this.stateHero = {};
    this.gamePlay.redrawPositions(statePosition);
    this.gamePlay.setCursor(cursors.pointer);
    if (this.aiTeam.length === 0) {
      this.nextLevel();
    } else if (this.humanTeam.length === 0) {
      GamePlay.showMessage('Game Over');
    }
  }

  nextLevel() {
    this.startPosition = [];
    this.selectHero = 0;
    this.stateHero = {};
    for (const iter of this.humanTeam) {
      iter.levelUp();
    }
    if (document.querySelector('.prairie') !== null) {
      this.theme = themes.desert;
      this.generateHumHeroes(this.humanHeroes, 1, 1);
    } else if (document.querySelector('.desert') !== null) {
      this.theme = themes.arctic;
      this.generateHumHeroes(this.humanHeroes, Math.floor(Math.random() * [1, 2].length), 1);
      this.generateHumHeroes(this.humanHeroes, Math.floor(Math.random() * [1, 2].length), 1);
    } else if (document.querySelector('.arctic') !== null) {
      this.theme = themes.mountain;
      this.generateHumHeroes(this.humanHeroes, Math.floor(Math.random() * [1, 2, 3].length), 1);
      this.generateHumHeroes(this.humanHeroes, Math.floor(Math.random() * [1, 2, 3].length), 1);
    } else if (document.querySelector('.mountain') !== null) {
      GamePlay.showMessage('Congratulation! You Win!');
    }
    this.gamePlay.drawUi(this.theme);
    for (const char of this.humanTeam) {
      this.generateAiHeroes(this.aiHeroes, char.level, 1);
    }
    this.startPositionChar(this.humanTeam, this.startPosHum, this.aiTeam, this.startPosAi);
    this.gamePlay.redrawPositions(this.startPosition);
  }

  onCellClick(index) {
    const cellClick = this.gamePlay.cells[index];
    if (this.humanTeam.includes(this.stateHero) && !cellClick.children[0]) {
      this.playMove(index, this.selectHero);
    } else if (this.humanTeam.includes(this.stateHero) && ['daemon', 'vampire', 'undead'].includes(cellClick.children[0].classList[1]) && this.attackHero.includes(index)) {
      this.playAttack(index, this.stateHero, cellClick);
    }
    for (let i = 0; i < this.humanTeam.length; i += 1) {
      if (this.humanTeam[i].type === cellClick.children[0].classList[1]) {
        this.gamePlay.deselectCell(this.selectHero);
        this.selectHero = index;
        this.gamePlay.selectCell(index);
        this.stateHero = this.humanTeam[i];
        this.moveHero = GameController.cellsMove(this.humanTeam[i], index);
        this.attackHero = GameController.cellsAttack(this.humanTeam[i], index);
      }
    }
    if (['daemon', 'vampire', 'undead'].includes(cellClick.children[0].classList[1]) && !this.attackHero.includes(index)) {
      GamePlay.showError('Not you hero!!!');
    }
  }

  onCellEnter(index) {
    const cellEnter = this.gamePlay.cells[index];
    if (this.moveHero.includes(index) && this.selectHero !== 0) {
      this.gamePlay.selectCell(index, 'green');
    }
    if (cellEnter.title && !cellEnter.children[0]) {
      this.gamePlay.hideCellTooltip(index);
    }
    const medal = '\u{1F396}';
    const swords = '\u{2694}';
    const shield = '\u{1F6E1}';
    const heart = '\u{2764}';
    let message = '';
    if (cellEnter.children[0]) {
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
          if (this.humanTeam.includes(this.stateHero) && this.attackHero.includes(index)) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, 'red');
          } else if (this.humanTeam.includes(this.stateHero) && !this.attackHero.includes(index)) {
            this.gamePlay.setCursor(cursors.notallowed);
          }
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
    if (cellLeave.children[0]) {
      for (let i = 0; i < this.aiTeam.length; i += 1) {
        if (this.aiTeam[i].type === cellLeave.children[0].classList[1]) {
          this.gamePlay.deselectCell(index, 'red');
          this.gamePlay.setCursor(cursors.pointer);
        }
      }
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

  static cellsMove(character, index) {
    const char = GameController.moveCharacter(character);
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

  static cellsAttack(character, index) {
    const char = GameController.attackCharacter(character);
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
      if (arrHor[numArr].includes(moveHorR)) {
        move.push(moveHorR);
        for (let j = 1; j < char; j += 1) {
          if (arr.includes(moveHorR + 8 * j)) move.push(moveHorR + 8 * j);
          if (arr.includes(moveHorR - 8 * j)) move.push(moveHorR - 8 * j);
        }
      }
    }
    let moveHorL = index;
    for (let i = 1; i < char; i += 1) {
      moveHorL -= horizont;
      if (arrHor[numArr].includes(moveHorL)) {
        move.push(moveHorL);
        for (let j = 1; j < char; j += 1) {
          if (arr.includes(moveHorL + 8 * j)) move.push(moveHorL + 8 * j);
          if (arr.includes(moveHorL - 8 * j)) move.push(moveHorL - 8 * j);
        }
      }
    }

    let moveVertU = index;
    for (let i = 1; i < char; i += 1) {
      moveVertU += vertical;
      if (arr.includes(moveVertU)) move.push(moveVertU);
    }
    let moveVertD = index;
    for (let i = 1; i < char; i += 1) {
      moveVertD -= vertical;
      if (arr.includes(moveVertD)) move.push(moveVertD);
    }
    return move;
  }
}

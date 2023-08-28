import Character from '../base-character/Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.type = 'magician';
    this.attack = 10;
    this.defense = 40;
    this.moveCell = 2;
    this.attackCell = 5;
  }
}

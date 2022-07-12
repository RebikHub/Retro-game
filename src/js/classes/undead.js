import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.type = 'undead';
    this.attack = 40;
    this.defense = 10;
    this.moveCell = 5;
    this.attackCell = 2;
  }
}

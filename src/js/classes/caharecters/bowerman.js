import Character from '../base-character/Character';

export default class Bowerman extends Character {
  constructor(level) {
    super(level);
    this.type = 'bowman';
    this.attack = 25;
    this.defense = 25;
    this.moveCell = 3;
    this.attackCell = 3;
  }
}

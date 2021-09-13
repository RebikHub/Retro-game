import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.type = 'Undead';
    this.attack = 40;
    this.defence = 10;
  }
}

import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.type = 'Swordsman';
    this.attack = 40;
    this.defence = 10;
  }
}

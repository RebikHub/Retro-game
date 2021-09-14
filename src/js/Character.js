export default class Character {
  constructor(type = 'generic') {
    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
  }

  levelUp() {
    this.level += 1;
    const ratio = 1.8 - (100 - this.health) / 100;
    this.attack = Math.max(this.attack, this.attack * ratio);
    this.defence = Math.max(this.defence, this.defence * ratio);
    if (this.health > 0) {
      this.health += 80;
      if (this.health > 100) this.health = 100;
    } else {
      throw new Error('The deceased cannot be leveled!!!');
    }
  }
}

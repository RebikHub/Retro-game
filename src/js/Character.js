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
    this.attack = Math.max(this.attack, (this.attack * (1.8 - this.health)) / 100);
    this.defence = Math.max(this.defence, (this.defence * (1.8 - this.health)) / 100);
    if (this.health > 0) {
      this.health += 80;
      if (this.health > 100) this.health = 100;
    } else {
      throw new Error('The deceased cannot be leveled!!!');
    }
  }

  damage(points) {
    if (this.health >= 0) {
      this.health -= points * (1 - this.defence / 100);
    }
  }
}

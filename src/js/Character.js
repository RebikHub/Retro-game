export default class Character {
  constructor(type = 'generic') {
    // if (new.target === Character) {
    //   throw new Error('user use new Character()!!!');
    // }
    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }

  levelUp() {
    this.level += 1;
    const ratio = 1.8 - (100 - this.health) / 100;
    this.attack = +(Math.max(this.attack, this.attack * ratio)).toFixed(1);
    this.defence = +(Math.max(this.defence, this.defence * ratio)).toFixed(1);
    if (this.health > 0) {
      this.health += 80;
      if (this.health > 100) this.health = 100;
    } else {
      throw new Error('The deceased cannot be leveled!!!');
    }
  }
}

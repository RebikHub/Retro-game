import Character from '../Character';
import Swordsman from '../classes/swordsman';

test('error use new Character()', () => {
  expect(() => new Character()).toThrow('user use new Character()!!!');
});

test('not error use new Child extends Character', () => {
  expect(new Swordsman()).toEqual({
    attack: 40,
    defense: 10,
    health: 50,
    level: 1,
    type: 'swordsman',
  });
});

import Bowerman from '../classes/bowerman';
import GamePlay from '../GamePlay';

jest.mock('../Gameplay');
beforeEach(() => jest.resetAllMocks());

test('should templates', () => {
  const gamePlay = new GamePlay();
  const hero = new Bowerman(1);
  const medal = '\u{1F396}';
  const swords = '\u{2694}';
  const shield = '\u{1F6E1}';
  const heart = '\u{2764}';
  const message = `${medal} ${hero.level} ${swords} ${hero.attack} ${shield} ${hero.defence} ${heart} ${hero.health}`;
  gamePlay.showCellTooltip.mockReturnValue(message);

  expect(gamePlay.showCellTooltip(message, 0)).toEqual('\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50');
});

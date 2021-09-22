/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes) {
  const i = Math.floor(Math.random() * allowedTypes.length);
  yield new allowedTypes[i]();
}

export function generateTeam(allowedTypes, characterCount) {
  const team = [];
  let count = characterCount;
  while (count > 0) {
    team.push(characterGenerator(allowedTypes).next().value);
    count -= 1;
  }
  return team;
}

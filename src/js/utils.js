export function calcTileType(index, boardSize) {
  console.log(index);

  if (index === 0) {
    return 'top-left';
  } if (index === 7) {
    return 'top-right';
  } if (index === 56) {
    return 'bottom-left';
  } if (index === 63) {
    return 'bottom-right';
  }

  // TODO: write logic here
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

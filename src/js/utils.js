export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  } if (index > 0 && index < 7) {
    return 'top';
  } if (index === 7) {
    return 'top-right';
  } if (index > 7 && index < 56 && index % boardSize === 0) {
    return 'left';
  } if (index >= 15 && index <= 55 && (index + 1) % boardSize === 0) {
    return 'right';
  } if (index === 56) {
    return 'bottom-left';
  } if (index > 56 && index < 63) {
    return 'bottom';
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

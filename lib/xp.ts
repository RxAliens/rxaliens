export function xpForNextLevel(level: number) {
  const safe = Math.max(1, Math.floor(level || 1));
  return 100 + (safe - 1) * 50;
}

export function levelFromXp(totalXp: number) {
  let xp = Math.max(0, Math.floor(totalXp || 0));
  let level = 1;
  while (level < 100) {
    const need = xpForNextLevel(level);
    if (xp < need) break;
    xp -= need;
    level++;
  }
  return { level, currentXp: xp, nextXp: level >= 100 ? 0 : xpForNextLevel(level), progress: level >= 100 ? 100 : Math.min(100, Math.round((xp / xpForNextLevel(level)) * 100)) };
}

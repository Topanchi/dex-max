/**
 * Sugimori official artwork URLs from Bulbagarden Archives.
 * Source: https://archives.bulbagarden.net
 * Queried via MediaWiki API — 24 balls confirmed.
 * Balls introduced in Legends: Arceus (Feather, Wing, Jet, etc.) have no Sugimori artwork yet.
 */

const BASE = 'https://archives.bulbagarden.net/media/upload';

export const SUGIMORI_ARTWORK: Record<string, string> = {
  'poke-ball':    `${BASE}/a/a6/SugimoriPokeBall.png`,
  'master-ball':  `${BASE}/2/21/SugimoriMasterBall.png`,
  'great-ball':   `${BASE}/0/06/SugimoriGreatBall.png`,
  'ultra-ball':   `${BASE}/2/26/SugimoriUltraBall.png`,
  'safari-ball':  `${BASE}/3/3f/SugimoriSafariBall.png`,
  'net-ball':     `${BASE}/e/ed/SugimoriNetBall.png`,
  'dive-ball':    `${BASE}/8/85/SugimoriDiveBall.png`,
  'nest-ball':    `${BASE}/3/39/SugimoriNestBall.png`,
  'repeat-ball':  `${BASE}/0/0c/SugimoriRepeatBall.png`,
  'timer-ball':   `${BASE}/e/ec/SugimoriTimerBall.png`,
  'luxury-ball':  `${BASE}/b/b1/SugimoriLuxuryBall.png`,
  'premier-ball': `${BASE}/a/a1/SugimoriPremierBall.png`,
  'dusk-ball':    `${BASE}/7/77/SugimoriDuskBall.png`,
  'heal-ball':    `${BASE}/0/0d/SugimoriHealBall.png`,
  'quick-ball':   `${BASE}/7/79/SugimoriQuickBall.png`,
  'cherish-ball': `${BASE}/2/2d/SugimoriCherishBall.png`,
  'fast-ball':    `${BASE}/9/95/SugimoriFastBall.png`,
  'level-ball':   `${BASE}/4/41/SugimoriLevelBall.png`,
  'lure-ball':    `${BASE}/4/4d/SugimoriLureBall.png`,
  'heavy-ball':   `${BASE}/2/2f/SugimoriHeavyBall.png`,
  'love-ball':    `${BASE}/f/ff/SugimoriLoveBall.png`,
  'friend-ball':  `${BASE}/4/4d/SugimoriFriendBall.png`,
  'moon-ball':    `${BASE}/0/0e/SugimoriMoonBall.png`,
  'beast-ball':   `${BASE}/c/c4/SugimoriBeastBall.png`,
};

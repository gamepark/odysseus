// Sampled directly from the game's own art (pixel-picked from app/src/images). Deliberately kept apart
// from the 4 skill colors (red #C01020 Strength, blue #00A0E0 Intelligence, yellow #F0D000 Cunning,
// green #60B050 Luck — see Skill.ts and the cube renders) so generic UI chrome never reads as a skill.
export const colors = {
  // Aegean sea — ShipBoard.jpg's water: deep corners (#2C7997/#297896), foam-lit highlight (#5CACDD).
  teal: '#2C7997',
  tealDeep: '#123240',
  tealLight: '#5CACDD',

  // Terracotta rope-lattice — ShipBoard.jpg's Trial card slots: base weave (#B04A2C), shadowed cord
  // (#582417), sun-bleached highlight (#C0935A). Doubles as the danger/alert color.
  terracotta: '#B0492C',
  terracottaDeep: '#582417',
  terracottaLight: '#C0935A',

  // Aged bronze / laurel gold — the wood trim and parchment ribbons running through every board and
  // card; kept warmer/duller than Cunning's lemon-yellow cube so it never reads as that skill.
  gold: '#B8862E',
  goldDeep: '#8A6220',
  goldLight: '#D9AC5C',

  // Parchment — the island Trial cards and Tale tile scrolls (#E2D3BA).
  cream: '#F2E9D5',
  creamSoft: '#FAF4E7',
  sand: '#D6BF9E',
}

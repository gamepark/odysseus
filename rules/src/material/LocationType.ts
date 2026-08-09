export enum LocationType {
  ShipBoardPlace = 1,
  TrialDeck, // the in-play draw pile, count depends on player count
  ShipTrialSlot, // id: ShipSide, x: 0-5 — the 12 row slots either side of the ship
  TaleDeck, // id: TaleStack — the 2 facedown stacks
  TaleDisplay, // x: 0-3 — the 4 face-up tale tiles
  EpicDeck, // the 5 epic tiles, ordered
  AthenaFavorSupply,
  AthenaFavorShipSlot, // id: ShipSide — the token between each row's central facedown pair
  StoryBoardPlace, // player
  SkillTrackCube, // player, id: Skill, x: 0-6 — cube position on the track
  PlayerAdventureColumn, // player, id: Skill, y: 0-3 — trial cards played "on adventure"
  PlayerRestPile, // player — trial cards played face down via "Rest"
  PlayerTale, // player — gathered tale tiles (max 6)
  PlayerEpic, // player — earned epic tile (0 or 1)
  PlayerAthenaFavor, // player
  /** UI-only: a player's info panel (avatar, name, score), displayed as part of the table so it scales with it (location.player = its owner), no item ever goes there */
  PlayerPanel
}

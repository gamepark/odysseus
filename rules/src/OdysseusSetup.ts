import { MaterialGameSetup } from '@gamepark/rules-api'
import { OdysseusOptions } from './OdysseusOptions'
import { OdysseusRules } from './OdysseusRules'
import { EpicTile, epicTiles } from './material/EpicTile'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { ShipSide } from './material/ShipSide'
import { StoryTileType, storyTileTypes } from './material/StoryTile'
import { TaleStack } from './material/TaleStack'
import { trialCards } from './material/TrialCard'
import { RuleId } from './rules/RuleId'
import { skills } from './Skill'

const TRIAL_CARDS_PER_PLAYER = 12
const SHIP_ROW_SLOTS = 6

/**
 * This class creates a new Game based on the game options
 */
export class OdysseusSetup extends MaterialGameSetup<number, MaterialType, LocationType, OdysseusOptions> {
  Rules = OdysseusRules

  setupMaterial(_options: OdysseusOptions) {
    this.setupTrialDeck()
    this.setupShipRows()
    this.setupTaleTiles()
    this.setupAthenaFavor()
    this.setupEpicTiles()
    this.setupPlayers()
    //this.setupDebugPlayerBoards()
  }

  /**
   * The rulebook doesn't say which of the 60 Trial cards are used for a given player count, only how many
   * (24/36/48/60 for 2-5 players). We shuffle the full deck and keep a random subset of the right size.
   */
  setupTrialDeck() {
    this.material(MaterialType.TrialCard).createItems(trialCards.map((id) => ({ id, location: { type: LocationType.TrialDeck } })))
    this.material(MaterialType.TrialCard).shuffle()
    const inPlayCount = this.players.length * TRIAL_CARDS_PER_PLAYER
    this.material(MaterialType.TrialCard)
      .location(LocationType.TrialDeck)
      .sort((item) => item.location.x!)
      .limit(trialCards.length - inPlayCount)
      .deleteItems()
  }

  /**
   * Deals 6 cards on each side of the ship: x 2-3 end up facedown (the "central" pair), x 0,1,4,5 face up
   * (TrialCardDescription.isFlipped decides the facedown look from the slot's x, not from deal order).
   */
  setupShipRows() {
    const deck = this.material(MaterialType.TrialCard).location(LocationType.TrialDeck).deck()
    for (const side of [ShipSide.Port, ShipSide.Starboard]) {
      for (let x = 0; x < SHIP_ROW_SLOTS; x++) {
        deck.dealOne({ type: LocationType.ShipTrialSlot, id: side, x, rotation: x === 2 || x === 3 })
      }
    }
  }

  /**
   * 28 Tale tiles (14 types x 2 copies), split into 2 facedown stacks, then the top 4 of stack "First" are revealed.
   */
  setupTaleTiles() {
    const ids: StoryTileType[] = storyTileTypes.flatMap((type) => [type, type])
    this.material(MaterialType.StoryTile).createItems(
      ids.map((id, index) => ({ id, location: { type: LocationType.TaleDeck, id: index % 2 === 0 ? TaleStack.First : TaleStack.Second } }))
    )
    this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(TaleStack.First).shuffle()
    this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(TaleStack.Second).shuffle()
    const stackFirst = this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(TaleStack.First).deck()
    for (let x = 0; x < 4; x++) {
      stackFirst.dealOne({ type: LocationType.TaleDisplay, x })
    }
  }

  /** 40 tokens in supply, 1 placed on each side of the ship (between the facedown central pair). */
  setupAthenaFavor() {
    this.material(MaterialType.AthenaFavorToken).createItem({ quantity: 40, location: { type: LocationType.AthenaFavorSupply } })
    for (const side of [ShipSide.Port, ShipSide.Starboard]) {
      this.material(MaterialType.AthenaFavorToken)
        .location(LocationType.AthenaFavorSupply)
        .moveItem({ type: LocationType.AthenaFavorShipSlot, id: side }, 1)
    }
  }

  /** Largest value on top of the stack. */
  setupEpicTiles() {
    this.material(MaterialType.EpicTile).createItems(
      epicTiles.map((id: EpicTile, index) => ({ id, location: { type: LocationType.EpicDeck, x: index } }))
    )
  }

  /** Per player: 4 skill cubes at value 0, 1 Tale tile, 1 Athena's Favor token, 1 player aid card. */
  setupPlayers() {
    const taleStackSecond = this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(TaleStack.Second).deck()
    for (const player of this.players) {
      this.material(MaterialType.SkillCube).createItems(skills.map((id) => ({ id, location: { type: LocationType.SkillTrackCube, player, id, x: 0 } })))
      taleStackSecond.dealOne({ type: LocationType.PlayerTale, player })
      this.material(MaterialType.AthenaFavorToken)
        .location(LocationType.AthenaFavorSupply)
        .moveItem({ type: LocationType.PlayerAthenaFavor, player }, 1)
    }
  }

  start() {
    this.startPlayerTurn(RuleId.ChooseTrialCard, this.players[0])
  }

  /**
   * Debug helper: fills every per-player location with visible items, to check locator positioning
   * at a glance. Not part of normal game setup — call it from setupMaterial() temporarily.
   */
  setupDebugPlayerBoards() {
    const REST_PILE_SIZE = 3
    const ADVENTURE_ROWS = 4
    const TALE_TILES = 6
    const ATHENA_FAVOR_COUNT = 12
    const TRACK_POSITIONS = 7 // x: 0-6

    for (const player of this.players) {
      let cardIndex = 0
      const nextTrialCard = () => trialCards[cardIndex++ % trialCards.length]

      this.material(MaterialType.TrialCard).createItems(
        Array.from({ length: REST_PILE_SIZE }, () => ({ id: nextTrialCard(), location: { type: LocationType.PlayerRestPile, player } }))
      )

      for (const skill of skills) {
        this.material(MaterialType.TrialCard).createItems(
          Array.from({ length: ADVENTURE_ROWS }, (_, y) => ({
            id: nextTrialCard(),
            location: { type: LocationType.PlayerAdventureColumn, player, id: skill, y }
          }))
        )
      }

      this.material(MaterialType.StoryTile).createItems(
        Array.from({ length: TALE_TILES }, (_, i) => ({
          id: storyTileTypes[i % storyTileTypes.length],
          location: { type: LocationType.PlayerTale, player }
        }))
      )

      this.material(MaterialType.EpicTile).createItem({ id: EpicTile.Value2, location: { type: LocationType.PlayerEpic, player } })

      this.material(MaterialType.AthenaFavorToken).createItem({ quantity: ATHENA_FAVOR_COUNT, location: { type: LocationType.PlayerAthenaFavor, player } })

      for (const skill of skills) {
        this.material(MaterialType.SkillCube).createItems(
          Array.from({ length: TRACK_POSITIONS }, (_, x) => ({ id: skill, location: { type: LocationType.SkillTrackCube, player, id: skill, x } }))
        )
      }
    }
  }
}

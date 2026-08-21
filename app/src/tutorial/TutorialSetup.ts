import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ShipSide } from '@gamepark/odysseus/material/ShipSide'
import { StoryTileType } from '@gamepark/odysseus/material/StoryTile'
import { trialCards, TrialCard } from '@gamepark/odysseus/material/TrialCard'
import { OdysseusSetup, SHIP_ROW_SLOTS, TRIAL_CARDS_PER_PLAYER } from '@gamepark/odysseus/OdysseusSetup'

/**
 * The Trial cards the scripted opening turns rely on (see Tutorial.tsx): {@link setupTrialDeck} keeps
 * them out of the random cut, {@link setupShipRows} pins each to its slot on the Port row so the
 * narrative always finds the same cards in the same place. Everything else — the other 7 Ship slots,
 * both players' Athena Favor, the Epic tiles, the Tale display — is left to the normal random setup.
 */
const FIXED_SHIP_SLOTS: { side: ShipSide; x: number; id: TrialCard }[] = [
  // Turn 1 (me): picked from the end, its printed Favor + Intelligence gains are the first thing taught.
  { side: ShipSide.Port, x: 0, id: TrialCard.Trial4Strength },
  // Turn 2 (Poséidon, forced): empty gains, so its whole resolution — and turn — completes as a single
  // consequence of the pick, with no further move required before control returns to the tutorial script.
  { side: ShipSide.Port, x: 1, id: TrialCard.Trial9Strength },
  // Turn 3 (me): the hidden pair Poséidon's turn 2 reveals; both have empty gains too, so my second pick
  // never needs a skill-gain decision beyond what turn 1 already taught.
  { side: ShipSide.Port, x: 2, id: TrialCard.Trial1Strength },
  { side: ShipSide.Port, x: 5, id: TrialCard.Trial5Cunning },
  { side: ShipSide.Starboard, x: 0, id: TrialCard.Trial6Strength },
  { side: ShipSide.Starboard, x: 5, id: TrialCard.Trial8Cunning }
]

export class TutorialSetup extends OdysseusSetup {
  /** Same random cut as a real game, except the {@link FIXED_SHIP_SLOTS} cards are never among the discards. */
  setupTrialDeck() {
    this.material(MaterialType.TrialCard).createItems(trialCards.map((id) => ({ id, location: { type: LocationType.TrialDeck } })))
    this.material(MaterialType.TrialCard).location(LocationType.TrialDeck).shuffle()
    const fixedIds = FIXED_SHIP_SLOTS.map((slot) => slot.id)
    const inPlayCount = this.players.length * TRIAL_CARDS_PER_PLAYER
    this.material(MaterialType.TrialCard)
      .location(LocationType.TrialDeck)
      .id((id: TrialCard) => !fixedIds.includes(id))
      .sort((item) => item.location.x!)
      .limit(trialCards.length - inPlayCount)
      .deleteItems()
  }

  /** Pins the {@link FIXED_SHIP_SLOTS} cards first, then deals the (still shuffled) rest as usual. */
  setupShipRows() {
    for (const { side, x, id } of FIXED_SHIP_SLOTS) {
      this.material(MaterialType.TrialCard)
        .id(id)
        .moveItem({ type: LocationType.ShipTrialSlot, id: side, x, rotation: x === 2 || x === 3 })
    }
    const deck = this.material(MaterialType.TrialCard).location(LocationType.TrialDeck).deck()
    for (const side of [ShipSide.Port, ShipSide.Starboard]) {
      for (let x = 0; x < SHIP_ROW_SLOTS; x++) {
        if (FIXED_SHIP_SLOTS.some((slot) => slot.side === side && slot.x === x)) continue
        deck.dealOne({ type: LocationType.ShipTrialSlot, id: side, x, rotation: x === 2 || x === 3 })
      }
    }
  }

  /**
   * The rest of the setup (Favor, Epic tiles, skill cubes...) is left random; only the human player's
   * starting Tale is fixed, so it matches the Force Trial they are taught to pick on turn 1.
   */
  setupPlayers() {
    super.setupPlayers()
    const me = this.players[0]
    this.material(MaterialType.StoryTile).location(LocationType.PlayerTale).player(me).getItem()!.id = StoryTileType.Strength
  }
}

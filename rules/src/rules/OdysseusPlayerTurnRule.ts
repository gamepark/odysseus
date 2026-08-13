import { isMoveItemType, ItemMove, Material, MaterialMove, MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { TaleStack } from '../material/TaleStack'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

/** A player never holds more than 6 Tale tiles, the starting one included (rules-fr.pdf p.6 "Récits"). */
export const MAX_TALES = 6

/** Also used client-side, to tell a Tale purchase from a redirected gain in the log (see OdysseusLogDescription). */
export const TALE_COST = 3

const TALE_STACKS = [TaleStack.First, TaleStack.Second]

export const isTaleTaken = (move: ItemMove): move is MoveItem<number, MaterialType, LocationType> =>
  isMoveItemType(MaterialType.StoryTile)(move) && move.location.type === LocationType.PlayerTale

/**
 * Common base of every rule the active player plays through, because taking a Tale tile
 * (rules-fr.pdf p.6 "Récits") can happen in any of them: the 3 Athena Favors may be spent "une seule
 * fois pendant votre tour", at any point of it, so the offer follows the player from rule to rule
 * instead of living in one of them.
 *
 * Taking the tile *is* the purchase — there is no separate "spend 3 Favors" decision to make first,
 * so no custom move either: the Favors leave as a consequence of the tile move, priced here in
 * {@link beforeItemMove}. The one Tale that costs nothing is the one granted by a completed row of 4
 * Trial cards, and {@link ChooseTaleRule} is the only rule where that happens — it says so by
 * overriding {@link isTaleFree}.
 */
export abstract class OdysseusPlayerTurnRule extends PlayerTurnRule {
  /** Only the Tale granted by a completed row is free; everywhere else it is bought with Favors. */
  get isTaleFree() {
    return false
  }

  get tales() {
    return this.material(MaterialType.StoryTile).location(LocationType.PlayerTale).player(this.player)
  }

  get favors() {
    return this.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(this.player)
  }

  /**
   * Whether there is still a tile to take: 28 of them for up to 5 players holding 6 each, so the
   * display and both stacks can run dry before everyone has had their fill.
   */
  get canTakeTale() {
    const tiles = this.material(MaterialType.StoryTile)
    return tiles.location(LocationType.TaleDisplay).length > 0 || tiles.location(LocationType.TaleDeck).length > 0
  }

  /** Whether the player may buy a Tale: once per turn, 6 Tales maximum, 3 Favors in hand. */
  get canBuyTale() {
    return (
      !this.remind<boolean>(Memory.TaleBoughtThisTurn, this.player) &&
      this.tales.length < MAX_TALES &&
      this.canTakeTale &&
      this.favors.getQuantity() >= TALE_COST
    )
  }

  /**
   * Hands the turn over — through BuyTaleRule when the player can still buy a Tale, since nothing
   * would ask them again once FinishTurnRule has moved on to the next player.
   */
  endTurn(): MaterialMove {
    return this.startRule(this.canBuyTale ? RuleId.BuyTale : RuleId.FinishTurn)
  }

  /** Any of the 4 visible tiles, or the top of either facedown stack — both are shuffled and hidden, so which one has no bearing on gameplay. */
  getTaleMoves(): MaterialMove[] {
    const moves: MaterialMove[] = this.material(MaterialType.StoryTile)
      .location(LocationType.TaleDisplay)
      .moveItems({ type: LocationType.PlayerTale, player: this.player })
    for (const stack of TALE_STACKS) {
      const pile = this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(stack).deck()
      if (pile.length) {
        moves.push(pile.dealOne({ type: LocationType.PlayerTale, player: this.player }))
      }
    }
    return moves
  }

  /**
   * Pays for the tile, and remembers the display slot it leaves empty so that {@link afterItemMove}
   * can refill it — read here because the origin is still the display at this point. Both hooks run
   * their consequences after the move itself, but this one's come first, hence the price landing ahead
   * of the rule change {@link ChooseTaleRule} and {@link BuyTaleRule} queue in afterItemMove: a spend
   * left behind a rule change would be read as the next player's (see OdysseusLogDescription, which
   * attributes it to the rule's current player).
   */
  beforeItemMove(move: ItemMove): MaterialMove[] {
    if (!isTaleTaken(move)) return []
    const origin = this.material(MaterialType.StoryTile).getItem(move.itemIndex).location
    if (origin.type === LocationType.TaleDisplay) {
      this.memorize(Memory.AwaitingReplenish, origin.x, this.player)
    }
    if (this.isTaleFree) return []
    this.memorize(Memory.TaleBoughtThisTurn, true, this.player)
    return [this.favors.deleteItem(TALE_COST)]
  }

  /** A tile taken from the display is immediately replaced by the first of either facedown stack. */
  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isTaleTaken(move)) return []
    const x = this.remind<number | undefined>(Memory.AwaitingReplenish, this.player)
    if (x === undefined) return []
    this.forget(Memory.AwaitingReplenish, this.player)
    const deal = this.dealTale(x)
    return deal ? [deal] : []
  }

  /**
   * The rulebook lets the player pick which stack the replacement comes from (rules-fr.pdf p.6, "vous
   * le remplacez par le premier de l'une des deux pioches"), a choice with no bearing on gameplay since
   * both are shuffled and hidden — so it is made here rather than asked for. Drawing from the taller
   * stack keeps the two even, which is what makes the choice offered by {@link getTaleMoves} last as
   * long as possible; ties go to the first stack.
   */
  dealTale(x: number): MaterialMove | undefined {
    let tallest: Material<number, MaterialType, LocationType> | undefined
    for (const stack of TALE_STACKS) {
      const pile = this.material(MaterialType.StoryTile).location(LocationType.TaleDeck).locationId(stack)
      if (pile.length && (!tallest || pile.length > tallest.length)) tallest = pile
    }
    return tallest?.deck().dealOne({ type: LocationType.TaleDisplay, x })
  }
}

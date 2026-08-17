import { isMoveItemType, MaterialGame, MaterialMove, RandomBot } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { getStoryTileScore, StoryTileType } from './material/StoryTile'
import { getTrialCardSkill, TrialCard } from './material/TrialCard'
import { adventureTypeOf, PendingGains, trialCardStats } from './material/TrialCardStats'
import { isFreeSkillGain } from './rules/ResolveSkillGainRule'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'
import { OdysseusRules } from './OdysseusRules'
import { Skill, skills } from './Skill'

/** A gained Athena Favor is worth roughly this many points, since 3 of them buy a Tale worth several. */
const FAVOR_BONUS = 2
/** A completed row grants a free Tale, on top of whatever this card itself is worth. */
const ROW_BONUS = 6
/** Completing the 5 adventure types is rare and grants a whole Epic tile. */
const EPIC_BONUS = 8
/** Mirrors ResolveSkillGainRule's own constant: the 5 AdventureType values. */
const ADVENTURE_TYPES_FOR_EPIC = 5

/**
 * A simple heuristic opponent for the tutorial (rules-fr.pdf has no "Automa" rules of its own — this
 * is a generic stand-in, not the physical Automa cards, which are not implemented, see CLAUDE.md).
 *
 * It follows a few simple principles: rest as little as possible, favor cards that maximize points
 * (weighted down when their skill is still far from the value needed), collect Athena Favor tokens to
 * take new Tales instead of spending them on redirects, and pick the Tale tiles and skill raises that
 * fit the cards already on the board.
 */
export class OdysseusBot extends RandomBot<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number> {
  constructor(playerId: number) {
    super(OdysseusRules, playerId)
  }

  override getLegalMoves(game: MaterialGame<number, MaterialType, LocationType>): MaterialMove<number, MaterialType, LocationType>[] {
    const rules = new OdysseusRules(game)
    const legalMoves = super.getLegalMoves(game)
    const player = game.rule?.player
    if (player === undefined) return legalMoves
    switch (game.rule?.id) {
      case RuleId.ChooseTrialCard:
        return this.chooseCardMoves(rules, legalMoves)
      case RuleId.ResolveSkillGain:
        return this.chooseSkillMoves(rules, player, legalMoves)
      case RuleId.ChooseTale:
      case RuleId.BuyTale:
        return this.chooseTaleMoves(rules, player, legalMoves)
      default:
        return legalMoves
    }
  }

  /**
   * Rest as little as possible: whenever at least one of the pickable cards can go on adventure, only
   * consider those, and never the "rest" option — resting is kept purely as the forced fallback for
   * when every pickable card's skill column is already full. Tale purchases are deliberately ignored
   * here and left to {@link chooseTaleMoves} at BuyTaleRule, the last chance to spend Favors this turn.
   */
  private chooseCardMoves(rules: OdysseusRules, legalMoves: MaterialMove[]): MaterialMove[] {
    const isAdventureMove = (move: MaterialMove) => isMoveItemType(MaterialType.TrialCard)(move) && move.location.type === LocationType.PlayerAdventureColumn
    const isRestMove = (move: MaterialMove) => isMoveItemType(MaterialType.TrialCard)(move) && move.location.type === LocationType.PlayerRestPile
    const adventureMoves = legalMoves.filter(isAdventureMove)
    const candidates = adventureMoves.length ? adventureMoves : legalMoves.filter(isRestMove)
    if (!candidates.length) return legalMoves
    return this.pickBestMoves(candidates, (move) => this.scoreCardMove(rules, move))
  }

  private scoreCardMove(rules: OdysseusRules, move: MaterialMove): number {
    if (!isMoveItemType(MaterialType.TrialCard)(move) || move.location.type !== LocationType.PlayerAdventureColumn) return 0
    const player = move.location.player!
    const card = rules.material(MaterialType.TrialCard).getItem<TrialCard>(move.itemIndex).id!
    const skill = getTrialCardSkill(card)
    const stats = trialCardStats[card]
    const skillValue = rules.material(MaterialType.SkillCube).location(LocationType.SkillTrackCube).player(player).id(skill).getItem()!.location.x!
    const gap = Math.max(0, stats.value - skillValue)
    let score = Math.max(0, stats.victoryPoints - gap)
    score += stats.gains.filter((gain) => gain === 'AthenaFavor').length * FAVOR_BONUS
    const y = move.location.y!
    if (this.completesRow(rules, player, skill, y)) score += ROW_BONUS
    if (this.completesEpicSet(rules, player, card)) score += EPIC_BONUS
    return score
  }

  /** Whether every other skill column already has more than y cards, so this placement completes the row. */
  private completesRow(rules: OdysseusRules, player: number, skill: Skill, y: number): boolean {
    const others = skills.filter((s) => s !== skill)
    return others.every(
      (other) => rules.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(player).locationId(other).length > y
    )
  }

  private completesEpicSet(rules: OdysseusRules, player: number, card: TrialCard): boolean {
    if (rules.material(MaterialType.EpicTile).location(LocationType.PlayerEpic).player(player).length > 0) return false
    if (rules.material(MaterialType.EpicTile).location(LocationType.EpicDeck).length === 0) return false
    const cards = rules.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(player).getItems<TrialCard>()
    const types = new Set(cards.map((item) => adventureTypeOf(item.id!)))
    types.add(adventureTypeOf(card))
    return types.size === ADVENTURE_TYPES_FOR_EPIC
  }

  /**
   * Never spends an Athena Favor to redirect a skill gain — Favors are kept for Tales instead (see
   * {@link chooseTaleMoves}). Among the free options a card or a Rest leaves on offer, raises the
   * skill that unlocks the most points right now: an already-placed card becomes successful exactly
   * when its skill's track reaches its printed value, which is also how the endgame skill choice
   * (rules-fr.pdf p.7) should be made once no more cards will be added to a column.
   */
  private chooseSkillMoves(rules: OdysseusRules, player: number, legalMoves: MaterialMove[]): MaterialMove[] {
    const cubeMoves = legalMoves.filter(isMoveItemType(MaterialType.SkillCube))
    if (!cubeMoves.length) return legalMoves
    const pending = rules.remind<PendingGains>(Memory.PendingGains, player) ?? { gains: [], left: 0 }
    const freeMoves = cubeMoves.filter((move) => isFreeSkillGain(pending, rules.material(MaterialType.SkillCube).getItem<Skill>(move.itemIndex).id!))
    const candidates = freeMoves.length ? freeMoves : cubeMoves
    return this.pickBestMoves(candidates, (move) => this.scoreSkillMove(rules, player, move))
  }

  private scoreSkillMove(rules: OdysseusRules, player: number, move: MaterialMove): number {
    if (!isMoveItemType(MaterialType.SkillCube)(move)) return 0
    const item = rules.material(MaterialType.SkillCube).getItem<Skill>(move.itemIndex)
    const skill = item.id!
    const currentValue = item.location.x!
    const cards = rules.material(MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(player).locationId(skill).getItems<TrialCard>()
    let unlocked = 0
    let stillUseful = 0
    for (const c of cards) {
      const stats = trialCardStats[c.id!]
      if (stats.value === currentValue + 1) unlocked += stats.victoryPoints
      if (stats.value > currentValue) stillUseful++
    }
    return unlocked * 10 + stillUseful
  }

  /**
   * Takes the Tale tile that best fits the cards already on the board (rules-fr.pdf p.6 "Récits"): a
   * visible tile's type is known, so it scores by how many of the player's Trial cards it would match;
   * a facedown stack draw is unknown and scores 0, same as a visible tile with no match, so it is only
   * picked when nothing known scores better. Used both for the free Tale from a completed row and for
   * the once-per-turn purchase, which this bot always takes over passing (see priority on Favors above).
   */
  private chooseTaleMoves(rules: OdysseusRules, player: number, legalMoves: MaterialMove[]): MaterialMove[] {
    const taleMoves = legalMoves.filter(isMoveItemType(MaterialType.StoryTile))
    if (!taleMoves.length) return legalMoves
    const cards = rules.getScoredCards(player)
    return this.pickBestMoves(taleMoves, (move) => {
      if (!isMoveItemType(MaterialType.StoryTile)(move)) return 0
      const type = rules.material(MaterialType.StoryTile).getItem<StoryTileType>(move.itemIndex).id
      return type === undefined ? 0 : getStoryTileScore(type, cards)
    })
  }

  private pickBestMoves(moves: MaterialMove[], score: (move: MaterialMove) => number): MaterialMove[] {
    const scored = moves.map((move) => ({ move, score: score(move) }))
    const best = Math.max(...scored.map((s) => s.score))
    return scored.filter((s) => s.score === best).map((s) => s.move)
  }
}

import { getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'
import { getDisplayedPlayer } from '../DisplayedPlayer'
import { TABLE_Y_MAX, TABLE_Y_MIN } from './TableLayout'

/**
 * Every player's Story board is on the table, stacked in one column on the right — mine (relative index
 * 0, see getRelativePlayerIndex) on top — with the Trials climbing above their board, where the rules put
 * them.
 *
 * The whole column has to fit in the table's height, which is spent to the last unit by the ship board
 * (see TableLayout), so this file arbitrates what gives when it does not: first tuck the bottom card of a
 * column under its own board, then close the cards up on each other, and only in last resort let a row
 * bite into the one above. Whatever is given up, every Trial keeps showing its top third — the victory
 * point laurel is printed top left and ends 32% down the card.
 *
 * Room for everyone's Trials at once is what it tries for first; when that cannot be had — 4 players and
 * up — only the selected player's are laid out, the others piling up under their own board, and the rows
 * below the selected one are pushed down by the one band that is reserved (see PlayerAdventureColumnLocator).
 *
 * All of it is settled for a *full* column of 4 (MAX_CARDS_PER_SKILL), for a given player count, and
 * nothing here ever looks at what is actually on the table: the room above a board is reserved once and for
 * all, so no board ever moves because a card was played. Only choosing another player moves them, and only
 * while a single band is being reserved.
 */

/** x of the column: the Story boards all share it, only their row changes. */
export const STORY_BOARD_X = 14.5

/** Height of a Story board (see StoryBoardDescription). */
const BOARD_HEIGHT = 8.02

/** Trial cards are square (see TrialCardDescription). */
const CARD_SIZE = 6

/** A skill column never gathers more than 4 Trials over a game: that is what the band above a board holds. */
const MAX_TRIALS_PER_COLUMN = 4

/** How much of a Trial has to stay out in the open, whether it is the board or the next card covering it. */
const MIN_TRIAL_VISIBLE = CARD_SIZE / 3

/** Past this nothing more is gained: only the coloured band at the bottom of a Trial, 25% of it, is worth covering. */
const MAX_TRIAL_STEP = 4.5

/**
 * The bottom Trial of a column gets a touch more than the strict minimum: it is the one that goes under an
 * opaque board rather than under another Trial, and it anchors the column, so it is worth half a unit of the
 * step above it.
 */
const MIN_BOTTOM_TRIAL_VISIBLE = MIN_TRIAL_VISIBLE + 0.5

/**
 * How far a row may bite into the board above, if it ever comes to that. The bottom 11% of a Story board
 * is plain sea below the Tale tile slots (measured on StoryBoard.png), so nothing readable is lost.
 */
const MAX_BOARD_OVERLAP = 0.9

/** Past this the rows stop reading as one column. Height left over is centered instead of spread further. */
const MAX_ROW_GAP = 2.5

/** Story boards are drawn top row first, so a lower one covers the blank bottom edge of the one above. */
const FIRST_ROW_Z = 5
const ROW_Z_STEP = 0.1

const TABLE_HEIGHT = TABLE_Y_MAX - TABLE_Y_MIN

type RowLayout = {
  allTrialsShown: boolean
  trialStep: number
  firstTrialOffset: number
  rowPitch: number
  band: number
  blockTop: number
  height: number
}

/** Distance from a board's center up to the center of the bottom Trial of a column, for a given slide. */
function firstTrialOffset(slide: number) {
  return BOARD_HEIGHT / 2 + CARD_SIZE / 2 - slide
}

/** Height a full column of Trials claims above its board's top edge. */
function bandHeight(trialStep: number, slide: number) {
  return firstTrialOffset(slide) + (MAX_TRIALS_PER_COLUMN - 1) * trialStep + CARD_SIZE / 2 - BOARD_HEIGHT / 2
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** `bands` is how many full columns of Trials the height has to hold: every player's, or the selected one's alone. */
function computeLayout(players: number, bands: number): RowLayout {
  const boards = players * BOARD_HEIGHT
  const gaps = Math.max(1, players - 1)
  // What the columns may claim with the boards stacked edge to edge, which is what all of this is for.
  const budget = TABLE_HEIGHT - boards
  const share = budget / bands

  // Sliding the bottom card under its board costs one card per column; closing the cards up costs the three
  // others. So the bottom one gives way first, and only by as much as the height calls for — but never past
  // the point where it would be the most covered of the four: share / MAX_TRIALS_PER_COLUMN is where they
  // are all covered alike, and there is nothing to be gained by hiding the one that carries the column.
  const bottomVisible = clamp(
    share - (MAX_TRIALS_PER_COLUMN - 1) * MAX_TRIAL_STEP,
    Math.max(MIN_BOTTOM_TRIAL_VISIBLE, share / MAX_TRIALS_PER_COLUMN),
    CARD_SIZE
  )
  const slide = CARD_SIZE - bottomVisible
  let trialStep = Math.min(MAX_TRIAL_STEP, (share - bottomVisible) / (MAX_TRIALS_PER_COLUMN - 1))
  let rowGap = Math.min((budget - bands * bandHeight(trialStep, slide)) / gaps, MAX_ROW_GAP)

  // Last resort: the boards give up their blank bottom edge. Only 3 players need it, by a quarter unit.
  if (trialStep < MIN_TRIAL_VISIBLE) {
    trialStep = MIN_TRIAL_VISIBLE
    rowGap = Math.max((budget - bands * bandHeight(trialStep, slide)) / gaps, -MAX_BOARD_OVERLAP)
  }

  const band = bandHeight(trialStep, slide)
  return {
    allTrialsShown: bands === players,
    trialStep,
    firstTrialOffset: firstTrialOffset(slide),
    rowPitch: BOARD_HEIGHT + rowGap + (bands === players ? band : 0),
    band,
    height: bands * band + boards + (players - 1) * rowGap,
    blockTop: TABLE_Y_MIN + (TABLE_HEIGHT - (bands * band + boards + (players - 1) * rowGap)) / 2
  }
}

/**
 * Reserving a band per player is worth every concession the solver can make — nothing on the table moves
 * any more, whoever is being read. Up to 3 players it comes out; past that no amount of tucking and closing
 * up makes 4 or 5 full columns fit, and the last resort above hits its own limit, so only the selected
 * player's column gets its room.
 */
function computeBestLayout(players: number): RowLayout {
  const all = computeLayout(players, players)
  return all.height <= TABLE_HEIGHT + 1e-6 ? all : computeLayout(players, 1)
}

const layouts = new Map<number, RowLayout>()

function getLayout(context: MaterialContext): RowLayout {
  const players = context.rules.players.length
  let layout = layouts.get(players)
  if (!layout) layouts.set(players, (layout = computeBestLayout(players)))
  return layout
}

function getSelectedRow(context: MaterialContext) {
  return getRelativePlayerIndex(context, getDisplayedPlayer(context))
}

/**
 * y of a player's Story board. Every row carries its own band of Trials, unless there is only room for
 * one — then the rows above the selected player close up over the band they are not using.
 */
export function getStoryBoardRowY(player: number | undefined, context: MaterialContext): number {
  const { allTrialsShown, blockTop, band, rowPitch } = getLayout(context)
  const row = getRelativePlayerIndex(context, player)
  const bandAbove = allTrialsShown || row >= getSelectedRow(context) ? band : 0
  return blockTop + bandAbove + BOARD_HEIGHT / 2 + row * rowPitch
}

/** z of a player's Story board, increasing downward so a row always covers the row above, never the reverse. */
export function getStoryBoardRowZ(player: number | undefined, context: MaterialContext): number {
  return FIRST_ROW_Z + getRelativePlayerIndex(context, player) * ROW_Z_STEP
}

/** Vertical step between two Trials of a same skill column: as loose as this player count affords. */
export function getTrialStep(context: MaterialContext): number {
  return getLayout(context).trialStep
}

/** How high above their board's center the bottom Trial of a column sits: less than half a board once tucked under it. */
export function getFirstTrialOffset(context: MaterialContext): number {
  return getLayout(context).firstTrialOffset
}

/** Whether every player's Trials are laid out, and not just the selected player's. True up to 3 players. */
export function showsAllTrials(context: MaterialContext): boolean {
  return getLayout(context).allTrialsShown
}

// No getPositionDependencies override anywhere: everything here depends on the player count, which is
// fixed for the whole game, and on the selected player, which is the framework's own `rules.game.view`
// (see DisplayedPlayer) — and react-game already hands that to every locator's position dependencies.

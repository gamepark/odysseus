import { CustomMove, isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { expect, test } from 'vitest'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PendingGains } from '../material/TrialCardStats'
import { OdysseusSetup } from '../OdysseusSetup'
import { Skill } from '../Skill'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { ResolveSkillGainRule } from './ResolveSkillGainRule'
import { RuleId } from './RuleId'

/**
 * Player 1 goes on adventure with a card whose only gain is +1 in a skill they have already maxed
 * (bug report 5YkcGjUhJG3j): the turn used to end on the spot, never offering to spend the Athena
 * Favor to raise another skill instead.
 */
function resolveSkillGain(pending: PendingGains, favors: number) {
  const state = new OdysseusSetup().setup({ players: 2 })

  const strengthCube = state.items[MaterialType.SkillCube]!.find(
    (item) => item.location.type === LocationType.SkillTrackCube && item.location.player === 1 && item.location.id === Skill.Strength
  )!
  strengthCube.location.x = 6

  const p1Favor = state.items[MaterialType.AthenaFavorToken]!.find(
    (item) => item.location.type === LocationType.PlayerAthenaFavor && item.location.player === 1
  )!
  p1Favor.quantity = favors

  state.memory[Memory.PendingGains] = { 1: pending }
  state.rule = { id: RuleId.ResolveSkillGain, player: 1 }

  const rule = new ResolveSkillGainRule(state)
  const onStart = rule.onRuleStart()
  return { rule, onStart, state }
}

const favorQuantity = (state: ReturnType<typeof resolveSkillGain>['state']) =>
  state.items[MaterialType.AthenaFavorToken]!.find(
    (item) => item.location.type === LocationType.PlayerAthenaFavor && item.location.player === 1
  )!.quantity ?? 1

test('a maxed-out imposed gain is kept while an Athena Favor can still redirect it', () => {
  const { rule, onStart, state } = resolveSkillGain({ gains: [Skill.Strength], left: 1 }, 1)

  expect(onStart).toEqual([])
  expect(state.memory[Memory.PendingGains][1]).toEqual({ gains: [Skill.Strength], left: 1 })

  const moves = rule.getPlayerMoves()
  expect(moves.filter((move) => isMoveItemType(MaterialType.SkillCube)(move))).toHaveLength(3)
  expect(moves.some((move) => isCustomMoveType(CustomMoveType.ForfeitGain)(move))).toBe(true)
})

test('forfeiting the gain ends the resolution and keeps the Favor', () => {
  const { rule, state } = resolveSkillGain({ gains: [Skill.Strength], left: 1 }, 1)
  const forfeit = rule.getPlayerMoves().find((move) => isCustomMoveType(CustomMoveType.ForfeitGain)(move))!

  const consequences = rule.onCustomMove(forfeit as CustomMove)
  expect(state.memory[Memory.PendingGains][1]).toEqual({ gains: [], left: 0 })
  expect(consequences.length).toBeGreaterThan(0)
  expect(favorQuantity(state)).toBe(1)
})

test('with no Favor in hand, a maxed-out imposed gain is still dropped and the turn ends', () => {
  const { onStart, state } = resolveSkillGain({ gains: [Skill.Strength], left: 1 }, 0)
  expect(state.memory[Memory.PendingGains][1]).toEqual({ gains: [], left: 0 })
  expect(onStart.length).toBeGreaterThan(0)
})

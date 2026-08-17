import { MaterialMove } from '@gamepark/rules-api'
import { expect, test } from 'vitest'
import { OdysseusBot } from './OdysseusBot'
import { OdysseusRules } from './OdysseusRules'
import { OdysseusSetup } from './OdysseusSetup'

function applyMove(rules: OdysseusRules, move: MaterialMove<number>) {
  const consequences = rules.play(move)
  for (const consequence of consequences) applyMove(rules, consequence)
}

function playBotGame(players: number, maxIterations: number) {
  const setup = new OdysseusSetup()
  const state = setup.setup({ players })
  const rules = new OdysseusRules(state)
  const bots = new Map(rules.game.players.map((player) => [player, new OdysseusBot(player)]))

  let iterations = 0
  while (!rules.isOver() && iterations < maxIterations) {
    iterations++
    const player = rules.getActivePlayer()
    if (player === undefined) throw new Error(`No active player at iteration ${iterations}, rule=${JSON.stringify(rules.game.rule)}`)
    const moves = bots.get(player)!.run(rules.game)
    if (!moves.length) {
      throw new Error(`Bot found no move for player ${player} at iteration ${iterations}, rule=${JSON.stringify(rules.game.rule)}`)
    }
    for (const move of moves) applyMove(rules, move)
  }
  return { rules, iterations }
}

test.each([2, 3, 4, 5])('the tutorial bot plays full games with %i players without crashing', (players) => {
  for (let game = 0; game < 10; game++) {
    const { rules, iterations } = playBotGame(players, 20000)
    expect(rules.isOver()).toBe(true)
    for (const player of rules.game.players) {
      const score = rules.getScore(player)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(score)).toBe(true)
    }
    if (game === 0) console.log(`${players}p bot sample: finished in ${iterations} moves, scores=${rules.game.players.map((p) => rules.getScore(p))}`)
  }
})

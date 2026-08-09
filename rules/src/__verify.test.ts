import { MaterialMove } from '@gamepark/rules-api'
import { expect, test } from 'vitest'
import { OdysseusRules } from './OdysseusRules'
import { OdysseusSetup } from './OdysseusSetup'

function applyMove(rules: OdysseusRules, move: MaterialMove<number>, history: string[]) {
  history.push(`play ${JSON.stringify(move)} -> rule=${JSON.stringify(rules.game.rule)}`)
  const consequences = rules.play(move)
  history.push(`  consequences: ${JSON.stringify(consequences)}`)
  for (const consequence of consequences) applyMove(rules, consequence, history)
}

function playRandomGame(players: number, maxIterations: number) {
  const setup = new OdysseusSetup()
  const state = setup.setup({ players })
  const rules = new OdysseusRules(state)
  const history: string[] = []

  let iterations = 0
  while (!rules.isOver() && iterations < maxIterations) {
    iterations++
    const player = rules.getActivePlayer()
    if (player === undefined) throw new Error(`No active player at iteration ${iterations}, rule=${JSON.stringify(rules.game.rule)}`)
    const moves = rules.getLegalMoves(player)
    if (!moves.length) {
      throw new Error(
        `No legal moves for player ${player} at iteration ${iterations}, rule=${JSON.stringify(rules.game.rule)}, ` +
          `memory=${JSON.stringify(rules.game.memory)}\nHistory (last 20):\n${history.slice(-20).join('\n')}`
      )
    }
    const move = moves[Math.floor(Math.random() * moves.length)]
    applyMove(rules, move, history)
  }
  return { rules, iterations }
}

test.each([2, 3, 4, 5])('plays 25 full random games with %i players', (players) => {
  for (let game = 0; game < 25; game++) {
    const { rules, iterations } = playRandomGame(players, 20000)
    expect(rules.isOver()).toBe(true)
    for (const player of rules.game.players) {
      const score = rules.getScore(player)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(score)).toBe(true)
    }
    if (game === 0) console.log(`${players}p sample: finished in ${iterations} moves`)
  }
})

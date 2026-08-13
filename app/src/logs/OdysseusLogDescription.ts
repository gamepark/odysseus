import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { CustomMoveType } from '@gamepark/odysseus/rules/CustomMoveType'
import { RuleId } from '@gamepark/odysseus/rules/RuleId'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCreateItemType, isCustomMoveType, isDeleteItemType, isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { AdventureLog } from './AdventureLog'
import { GainFavorLog } from './GainFavorLog'
import { IncreaseSkillLog } from './IncreaseSkillLog'
import { RedirectSkillLog } from './RedirectSkillLog'
import { RestLog } from './RestLog'
import { RestockShipLog } from './RestockShipLog'
import { SpendFavorForTaleLog } from './SpendFavorForTaleLog'
import { WinEpicLog } from './WinEpicLog'
import { WinTaleLog } from './WinTaleLog'

export class OdysseusLogDescription implements LogDescription<MaterialMove, number, MaterialGame> {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext<MaterialMove, number, MaterialGame>): MovePlayedLogDescription | undefined {
    const ruleId = context.game.rule?.id

    if (ruleId === RuleId.ChooseTrialCard) {
      if (isMoveItemType(MaterialType.TrialCard)(move) && move.location.type === LocationType.PlayerAdventureColumn) {
        return { player: move.location.player, Component: AdventureLog }
      }
      if (isMoveItemType(MaterialType.TrialCard)(move) && move.location.type === LocationType.PlayerRestPile) {
        return { player: move.location.player, Component: RestLog }
      }
      if (isMoveItemType(MaterialType.AthenaFavorToken)(move) && move.location.type === LocationType.PlayerAthenaFavor) {
        return { player: move.location.player, Component: GainFavorLog, depth: 1 }
      }
      // Favors granted by a card or by resting are created out of the unlimited reserve, not moved from it.
      if (isCreateItemType(MaterialType.AthenaFavorToken)(move) && move.item.location.type === LocationType.PlayerAthenaFavor) {
        return { player: move.item.location.player, Component: GainFavorLog, depth: 1 }
      }
      if (isCustomMoveType(CustomMoveType.SpendFavorForTale)(move)) {
        return { player: context.game.rule?.player, Component: SpendFavorForTaleLog }
      }
    }

    if (ruleId === RuleId.ResolveSkillGain) {
      if (isMoveItemType(MaterialType.SkillCube)(move)) {
        return { player: move.location.player, Component: IncreaseSkillLog, depth: 1 }
      }
      // The only Favor spent while gains are resolved: the one that redirects a point to another skill.
      // A consequence of the cube move that triggered it, so it is logged right under it, as its price.
      if (isDeleteItemType(MaterialType.AthenaFavorToken)(move)) {
        return { player: context.game.rule?.player, Component: RedirectSkillLog, depth: 1 }
      }
      if (isMoveItemType(MaterialType.EpicTile)(move) && move.location.type === LocationType.PlayerEpic) {
        return { player: move.location.player, Component: WinEpicLog, depth: 1 }
      }
    }

    if (ruleId === RuleId.ChooseTale) {
      if (isMoveItemType(MaterialType.StoryTile)(move) && move.location.type === LocationType.PlayerTale) {
        return { player: move.location.player, Component: WinTaleLog }
      }
    }

    if (ruleId === RuleId.FinishTurn) {
      if (isDeleteItemType(MaterialType.TrialCard)(move)) {
        return { Component: RestockShipLog }
      }
    }

    return undefined
  }
}

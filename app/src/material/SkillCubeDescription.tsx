import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { PendingGains } from '@gamepark/odysseus/material/TrialCardStats'
import { Memory } from '@gamepark/odysseus/rules/Memory'
import { isFreeSkillGain } from '@gamepark/odysseus/rules/ResolveSkillGainRule'
import { Skill } from '@gamepark/odysseus/Skill'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import CunningCube from '../images/cubes/CunningCube.png'
import IntelligenceCube from '../images/cubes/IntelligenceCube.png'
import LuckCube from '../images/cubes/LuckCube.png'
import StrengthCube from '../images/cubes/StrengthCube.png'
import { FavorCost } from '../theme/FavorIcon'
import { OdysseusMenuButton } from '../theme/OdysseusMenuButton'
import { SkillCubeHelp } from './help/SkillCubeHelp'

/** How high above the cube the "+1" button floats: clear of the cube, still inside its own track's box. */
const BUTTON_Y = -2

class SkillCubeDescription extends TokenDescription<number, MaterialType, LocationType, Skill> {
  width = 1.65
  height = 1.67
  transparency = true
  help = SkillCubeHelp

  images = {
    [Skill.Strength]: StrengthCube,
    [Skill.Intelligence]: IntelligenceCube,
    [Skill.Cunning]: CunningCube,
    [Skill.Luck]: LuckCube
  }

  /**
   * All 4 buttons stand out at once while gains are being resolved, rather than appearing on the cube
   * that was clicked: the player picks the skills they want, in the order they want, and a click on a
   * cube is left free to open its help (see TrialCardDescription for the same trade-off).
   */
  menuAlwaysVisible = true

  /**
   * The button is the only way to raise a skill: dragging a cube one space along its own track is
   * fiddly, and a long press would spend an Athena Favor without ever showing its price.
   */
  canDrag = () => false
  canLongClick = () => false

  /**
   * One button per skill still raisable, on the active player's own board. It carries no label when
   * the Trial card offers that skill — the arrow says it all — and turns red, reading "-1 🦉", when
   * the point has to be redirected: ResolveSkillGainRule charges it as soon as the button is pressed.
   */
  getItemMenu(item: MaterialItem<number, LocationType, Skill>, context: ItemContext<number, MaterialType, LocationType>, legalMoves: MaterialMove[]) {
    const move = legalMoves.find((move) => isMoveItemType(MaterialType.SkillCube)(move) && move.itemIndex === context.index)
    if (!move) return null
    const free = isFreeSkillGain(context.rules.remind<PendingGains>(Memory.PendingGains, item.location.player), item.id!)
    return (
      <OdysseusMenuButton x={0} y={BUTTON_Y} move={move} cost={!free} label={free ? undefined : <FavorCost cost={1} />} labelPosition="right">
        <FontAwesomeIcon icon={faArrowUp} />
      </OdysseusMenuButton>
    )
  }
}

export const skillCubeDescription = new SkillCubeDescription()

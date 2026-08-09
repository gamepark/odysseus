import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { Skill } from '@gamepark/odysseus/Skill'
import { isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { ItemContext, TokenDescription } from '@gamepark/react-game'
import CunningCube from '../images/cubes/CunningCube.png'
import IntelligenceCube from '../images/cubes/IntelligenceCube.png'
import LuckCube from '../images/cubes/LuckCube.png'
import StrengthCube from '../images/cubes/StrengthCube.png'

class SkillCubeDescription extends TokenDescription<number, MaterialType, LocationType, Skill> {
  width = 1.65
  height = 1.67
  transparency = true

  images = {
    [Skill.Strength]: StrengthCube,
    [Skill.Intelligence]: IntelligenceCube,
    [Skill.Cunning]: CunningCube,
    [Skill.Luck]: LuckCube
  }

  /** ResolveSkillGainRule always advances a cube by exactly 1 step on its own track: a short click is unambiguous. */
  canShortClick(move: MaterialMove, context: ItemContext): boolean {
    return isMoveItemType(MaterialType.SkillCube)(move) && move.itemIndex === context.index
  }
}

export const skillCubeDescription = new SkillCubeDescription()

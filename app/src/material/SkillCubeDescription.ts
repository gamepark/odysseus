import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { Skill } from '@gamepark/odysseus/Skill'
import { TokenDescription } from '@gamepark/react-game'
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
}

export const skillCubeDescription = new SkillCubeDescription()

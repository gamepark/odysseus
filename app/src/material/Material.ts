import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { athenaFavorTokenDescription } from './AthenaFavorTokenDescription'
import { epicTileDescription } from './EpicTileDescription'
import { shipBoardDescription } from './ShipBoardDescription'
import { skillCubeDescription } from './SkillCubeDescription'
import { storyBoardDescription } from './StoryBoardDescription'
import { storyTileDescription } from './StoryTileDescription'
import { trialCardDescription } from './TrialCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.ShipBoard]: shipBoardDescription,
  [MaterialType.StoryBoard]: storyBoardDescription,
  [MaterialType.TrialCard]: trialCardDescription,
  [MaterialType.StoryTile]: storyTileDescription,
  [MaterialType.AthenaFavorToken]: athenaFavorTokenDescription,
  [MaterialType.EpicTile]: epicTileDescription,
  [MaterialType.SkillCube]: skillCubeDescription
}

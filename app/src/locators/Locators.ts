import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { athenaFavorShipSlotLocator } from './AthenaFavorShipSlotLocator'
import { athenaFavorSupplyLocator } from './AthenaFavorSupplyLocator'
import { epicDeckLocator } from './EpicDeckLocator'
import { playerAdventureColumnLocator } from './PlayerAdventureColumnLocator'
import { playerAthenaFavorLocator } from './PlayerAthenaFavorLocator'
import { playerEpicLocator } from './PlayerEpicLocator'
import { playerRestPileLocator } from './PlayerRestPileLocator'
import { playerTaleLocator } from './PlayerTaleLocator'
import { shipBoardPlaceLocator } from './ShipBoardPlaceLocator'
import { shipTrialSlotLocator } from './ShipTrialSlotLocator'
import { skillTrackCubeLocator } from './SkillTrackCubeLocator'
import { storyBoardPlaceLocator } from './StoryBoardPlaceLocator'
import { taleDeckLocator } from './TaleDeckLocator'
import { taleDisplayLocator } from './TaleDisplayLocator'
import { trialDeckLocator } from './TrialDeckLocator'

export const Locators: Partial<Record<LocationType, Locator<number, MaterialType, LocationType>>> = {
  [LocationType.ShipBoardPlace]: shipBoardPlaceLocator,
  [LocationType.TrialDeck]: trialDeckLocator,
  [LocationType.ShipTrialSlot]: shipTrialSlotLocator,
  [LocationType.TaleDeck]: taleDeckLocator,
  [LocationType.TaleDisplay]: taleDisplayLocator,
  [LocationType.EpicDeck]: epicDeckLocator,
  [LocationType.AthenaFavorSupply]: athenaFavorSupplyLocator,
  [LocationType.AthenaFavorShipSlot]: athenaFavorShipSlotLocator,
  [LocationType.StoryBoardPlace]: storyBoardPlaceLocator,
  [LocationType.SkillTrackCube]: skillTrackCubeLocator,
  [LocationType.PlayerAdventureColumn]: playerAdventureColumnLocator,
  [LocationType.PlayerRestPile]: playerRestPileLocator,
  [LocationType.PlayerTale]: playerTaleLocator,
  [LocationType.PlayerEpic]: playerEpicLocator,
  [LocationType.PlayerAthenaFavor]: playerAthenaFavorLocator
}

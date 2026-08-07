import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { isShipTrialSlotFaceDown, TrialCard } from '@gamepark/odysseus/material/TrialCard'
import { MaterialItem } from '@gamepark/rules-api'
import { CardDescription } from '@gamepark/react-game'
import Trial10Cunning from '../images/cards/trials/Trial10Cunning.jpg'
import Trial10Intelligence from '../images/cards/trials/Trial10Intelligence.jpg'
import Trial10Luck from '../images/cards/trials/Trial10Luck.jpg'
import Trial10Strength from '../images/cards/trials/Trial10Strength.jpg'
import Trial11Cunning from '../images/cards/trials/Trial11Cunning.jpg'
import Trial11Intelligence from '../images/cards/trials/Trial11Intelligence.jpg'
import Trial11Luck from '../images/cards/trials/Trial11Luck.jpg'
import Trial11Strength from '../images/cards/trials/Trial11Strength.jpg'
import Trial12Cunning from '../images/cards/trials/Trial12Cunning.jpg'
import Trial12Intelligence from '../images/cards/trials/Trial12Intelligence.jpg'
import Trial12Luck from '../images/cards/trials/Trial12Luck.jpg'
import Trial12Strength from '../images/cards/trials/Trial12Strength.jpg'
import Trial13Cunning from '../images/cards/trials/Trial13Cunning.jpg'
import Trial13Intelligence from '../images/cards/trials/Trial13Intelligence.jpg'
import Trial13Luck from '../images/cards/trials/Trial13Luck.jpg'
import Trial13Strength from '../images/cards/trials/Trial13Strength.jpg'
import Trial14Cunning from '../images/cards/trials/Trial14Cunning.jpg'
import Trial14Intelligence from '../images/cards/trials/Trial14Intelligence.jpg'
import Trial14Luck from '../images/cards/trials/Trial14Luck.jpg'
import Trial14Strength from '../images/cards/trials/Trial14Strength.jpg'
import Trial15Cunning from '../images/cards/trials/Trial15Cunning.jpg'
import Trial15Intelligence from '../images/cards/trials/Trial15Intelligence.jpg'
import Trial15Luck from '../images/cards/trials/Trial15Luck.jpg'
import Trial15Strength from '../images/cards/trials/Trial15Strength.jpg'
import Trial1Cunning from '../images/cards/trials/Trial1Cunning.jpg'
import Trial1Intelligence from '../images/cards/trials/Trial1Intelligence.jpg'
import Trial1Luck from '../images/cards/trials/Trial1Luck.jpg'
import Trial1Strength from '../images/cards/trials/Trial1Strength.jpg'
import Trial2Cunning from '../images/cards/trials/Trial2Cunning.jpg'
import Trial2Intelligence from '../images/cards/trials/Trial2Intelligence.jpg'
import Trial2Luck from '../images/cards/trials/Trial2Luck.jpg'
import Trial2Strength from '../images/cards/trials/Trial2Strength.jpg'
import Trial3Cunning from '../images/cards/trials/Trial3Cunning.jpg'
import Trial3Intelligence from '../images/cards/trials/Trial3Intelligence.jpg'
import Trial3Luck from '../images/cards/trials/Trial3Luck.jpg'
import Trial3Strength from '../images/cards/trials/Trial3Strength.jpg'
import Trial4Cunning from '../images/cards/trials/Trial4Cunning.jpg'
import Trial4Intelligence from '../images/cards/trials/Trial4Intelligence.jpg'
import Trial4Luck from '../images/cards/trials/Trial4Luck.jpg'
import Trial4Strength from '../images/cards/trials/Trial4Strength.jpg'
import Trial5Cunning from '../images/cards/trials/Trial5Cunning.jpg'
import Trial5Intelligence from '../images/cards/trials/Trial5Intelligence.jpg'
import Trial5Luck from '../images/cards/trials/Trial5Luck.jpg'
import Trial5Strength from '../images/cards/trials/Trial5Strength.jpg'
import Trial6Cunning from '../images/cards/trials/Trial6Cunning.jpg'
import Trial6Intelligence from '../images/cards/trials/Trial6Intelligence.jpg'
import Trial6Luck from '../images/cards/trials/Trial6Luck.jpg'
import Trial6Strength from '../images/cards/trials/Trial6Strength.jpg'
import Trial7Cunning from '../images/cards/trials/Trial7Cunning.jpg'
import Trial7Intelligence from '../images/cards/trials/Trial7Intelligence.jpg'
import Trial7Luck from '../images/cards/trials/Trial7Luck.jpg'
import Trial7Strength from '../images/cards/trials/Trial7Strength.jpg'
import Trial8Cunning from '../images/cards/trials/Trial8Cunning.jpg'
import Trial8Intelligence from '../images/cards/trials/Trial8Intelligence.jpg'
import Trial8Luck from '../images/cards/trials/Trial8Luck.jpg'
import Trial8Strength from '../images/cards/trials/Trial8Strength.jpg'
import Trial9Cunning from '../images/cards/trials/Trial9Cunning.jpg'
import Trial9Intelligence from '../images/cards/trials/Trial9Intelligence.jpg'
import Trial9Luck from '../images/cards/trials/Trial9Luck.jpg'
import Trial9Strength from '../images/cards/trials/Trial9Strength.jpg'
import TrialBack from '../images/cards/TrialBack.jpg'

class TrialCardDescription extends CardDescription<number, MaterialType, LocationType, TrialCard> {
  width = 6
  height = 6
  // Opts out of the framework's default box-shadow outline (see componentSizeCss.shadowCss): it's meant
  // for images that already bake their own shadow into a transparent PNG, but doubles as the only way to
  // disable it entirely, which is what we want for these flat, shadowless JPEGs.
  transparency = true

  images = {
    [TrialCard.Trial1Cunning]: Trial1Cunning,
    [TrialCard.Trial1Luck]: Trial1Luck,
    [TrialCard.Trial1Strength]: Trial1Strength,
    [TrialCard.Trial1Intelligence]: Trial1Intelligence,
    [TrialCard.Trial2Cunning]: Trial2Cunning,
    [TrialCard.Trial2Luck]: Trial2Luck,
    [TrialCard.Trial2Strength]: Trial2Strength,
    [TrialCard.Trial2Intelligence]: Trial2Intelligence,
    [TrialCard.Trial3Cunning]: Trial3Cunning,
    [TrialCard.Trial3Luck]: Trial3Luck,
    [TrialCard.Trial3Strength]: Trial3Strength,
    [TrialCard.Trial3Intelligence]: Trial3Intelligence,
    [TrialCard.Trial4Cunning]: Trial4Cunning,
    [TrialCard.Trial4Luck]: Trial4Luck,
    [TrialCard.Trial4Strength]: Trial4Strength,
    [TrialCard.Trial4Intelligence]: Trial4Intelligence,
    [TrialCard.Trial5Cunning]: Trial5Cunning,
    [TrialCard.Trial5Luck]: Trial5Luck,
    [TrialCard.Trial5Strength]: Trial5Strength,
    [TrialCard.Trial5Intelligence]: Trial5Intelligence,
    [TrialCard.Trial6Cunning]: Trial6Cunning,
    [TrialCard.Trial6Luck]: Trial6Luck,
    [TrialCard.Trial6Strength]: Trial6Strength,
    [TrialCard.Trial6Intelligence]: Trial6Intelligence,
    [TrialCard.Trial7Cunning]: Trial7Cunning,
    [TrialCard.Trial7Luck]: Trial7Luck,
    [TrialCard.Trial7Strength]: Trial7Strength,
    [TrialCard.Trial7Intelligence]: Trial7Intelligence,
    [TrialCard.Trial8Cunning]: Trial8Cunning,
    [TrialCard.Trial8Luck]: Trial8Luck,
    [TrialCard.Trial8Strength]: Trial8Strength,
    [TrialCard.Trial8Intelligence]: Trial8Intelligence,
    [TrialCard.Trial9Cunning]: Trial9Cunning,
    [TrialCard.Trial9Luck]: Trial9Luck,
    [TrialCard.Trial9Strength]: Trial9Strength,
    [TrialCard.Trial9Intelligence]: Trial9Intelligence,
    [TrialCard.Trial10Cunning]: Trial10Cunning,
    [TrialCard.Trial10Luck]: Trial10Luck,
    [TrialCard.Trial10Strength]: Trial10Strength,
    [TrialCard.Trial10Intelligence]: Trial10Intelligence,
    [TrialCard.Trial11Cunning]: Trial11Cunning,
    [TrialCard.Trial11Luck]: Trial11Luck,
    [TrialCard.Trial11Strength]: Trial11Strength,
    [TrialCard.Trial11Intelligence]: Trial11Intelligence,
    [TrialCard.Trial12Cunning]: Trial12Cunning,
    [TrialCard.Trial12Luck]: Trial12Luck,
    [TrialCard.Trial12Strength]: Trial12Strength,
    [TrialCard.Trial12Intelligence]: Trial12Intelligence,
    [TrialCard.Trial13Cunning]: Trial13Cunning,
    [TrialCard.Trial13Luck]: Trial13Luck,
    [TrialCard.Trial13Strength]: Trial13Strength,
    [TrialCard.Trial13Intelligence]: Trial13Intelligence,
    [TrialCard.Trial14Cunning]: Trial14Cunning,
    [TrialCard.Trial14Luck]: Trial14Luck,
    [TrialCard.Trial14Strength]: Trial14Strength,
    [TrialCard.Trial14Intelligence]: Trial14Intelligence,
    [TrialCard.Trial15Cunning]: Trial15Cunning,
    [TrialCard.Trial15Luck]: Trial15Luck,
    [TrialCard.Trial15Strength]: Trial15Strength,
    [TrialCard.Trial15Intelligence]: Trial15Intelligence,
  }

  backImage = TrialBack

  isFlipped(item: Partial<MaterialItem<number, LocationType>>): boolean {
    switch (item.location?.type) {
      case LocationType.TrialDeck:
      case LocationType.PlayerRestPile:
        return true
      case LocationType.ShipTrialSlot:
        return isShipTrialSlotFaceDown(item.location.x)
      default:
        return false
    }
  }
}

export const trialCardDescription = new TrialCardDescription()

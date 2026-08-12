import { AdventureType } from '@gamepark/odysseus/material/TrialCardStats'
import { Skill } from '@gamepark/odysseus/Skill'
import Creatures from './icons/Creatures.png'
import Cunning from './icons/Cunning.png'
import Encounters from './icons/Encounters.png'
import Gods from './icons/Gods.png'
import Intelligence from './icons/Intelligence.png'
import Ithaca from './icons/Ithaca.png'
import Luck from './icons/Luck.png'
import Navigation from './icons/Navigation.png'
import Strength from './icons/Strength.png'

/** The 4 skill emblems, in the colors of the cubes and of the tracks they run on. */
export const skillIcons: Record<Skill, string> = {
  [Skill.Strength]: Strength,
  [Skill.Intelligence]: Intelligence,
  [Skill.Cunning]: Cunning,
  [Skill.Luck]: Luck
}

/** The 5 category icons printed top-right on a Trial card, which the Tale tiles score on. */
export const adventureTypeIcons: Record<AdventureType, string> = {
  [AdventureType.Navigation]: Navigation,
  [AdventureType.Gods]: Gods,
  [AdventureType.Creatures]: Creatures,
  [AdventureType.Encounters]: Encounters,
  [AdventureType.Ithaca]: Ithaca
}

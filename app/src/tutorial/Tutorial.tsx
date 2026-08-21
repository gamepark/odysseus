import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { ShipSide } from '@gamepark/odysseus/material/ShipSide'
import { TrialCard } from '@gamepark/odysseus/material/TrialCard'
import { Skill } from '@gamepark/odysseus/Skill'
import { MaterialTutorial, Picture, TutorialStep } from '@gamepark/react-game'
import { getEnumValues, isCreateItemType, isMoveItemType, MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import Skills from '../images/icons/Skills.png'
import { FavorIcon } from '../theme/FavorIcon'
import { AdventureTypeIcons, BaseComponents, skillComponents, skillIconCss } from './TutorialIcons'
import { TutorialSetup } from './TutorialSetup'

const me = 1
const opponent = 2

/** Wide crop of a Trial card's full face: the default when a step just wants to show the card itself. */
const cardMargin = { top: 1, bottom: 1, right: 1, left: 1 }
/** Crops a 6x6cm Trial card down to its top-left corner, where the threshold value and VP are printed. */
const cardTopLeftMargin = { right: -3, bottom: -3.3 }

export class Tutorial extends MaterialTutorial<number, MaterialType, LocationType> {
  version = 1

  options = {
    players: [{ id: me }, { id: opponent }]
  }

  players = [{ id: me }, { id: opponent, name: 'Poséidon' }]

  setup = new TutorialSetup()

  steps: TutorialStep<number, MaterialType, LocationType>[] = [
    {
      popup: { text: () => <Trans defaults="tuto.welcome" components={BaseComponents} /> }
    },
    {
      popup: { text: () => <Trans defaults="tuto.goal" components={BaseComponents} /> }
    },
    {
      popup: { text: () => <Trans defaults="tuto.cards" components={BaseComponents} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).location(LocationType.ShipTrialSlot)],
        margin: { top: 2, bottom: 2, left: 1, right: 1 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.board" components={{ ...BaseComponents, ...skillComponents, emblem: <Picture src={Skills} css={skillIconCss} /> }} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.SkillCube).player(me)],
        margin: { top: 3, bottom: 3, left: 3, right: 3 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.pick" components={{ ...BaseComponents, strength: skillComponents.strength }} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).id(TrialCard.Trial4Strength)],
        margin: cardMargin
      }),
      move: {
        filter: (move, game) => this.isPlayCard(TrialCard.Trial4Strength, LocationType.PlayerAdventureColumn, move, game),
        interrupt: isCreateItemType(MaterialType.AthenaFavorToken)
      }
    },
    {
      popup: { text: () => <Trans defaults="tuto.value" components={{ ...BaseComponents, strength: skillComponents.strength }} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).id(TrialCard.Trial4Strength)],
        margin: cardTopLeftMargin
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.gains" components={{ ...BaseComponents, favor: <FavorIcon />, intelligence: skillComponents.intelligence }} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).id(TrialCard.Trial4Strength)],
        margin: cardMargin
      }),
      move: {}
    },
    {
      popup: { text: () => <Trans defaults="tuto.favorStart" components={{ ...BaseComponents, favor: <FavorIcon /> }} />, position: { y: 25} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(me)],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.raiseIntelligence" components={{ ...BaseComponents, intelligence: skillComponents.intelligence }} />, position: { y: 25} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.SkillCube).player(me).id(Skill.Intelligence)],
        margin: { top: 3, bottom: 3, left: 3, right: 3 }
      }),
      move: {
        filter: (move, game) => this.isRaiseSkill(Skill.Intelligence, move, game)
      }
    },
    {
      popup: { text: () => <Trans defaults="tuto.turnEnd" components={BaseComponents} /> }
    },
    {
      popup: { text: () => <Trans defaults="tuto.hidden" components={BaseComponents} />, position: { y: 20, x: 50 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).location(LocationType.ShipTrialSlot).location((l) => l.x === 2 || l.x === 3)],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.hiddenReveal" components={{ ...BaseComponents, favor: <FavorIcon /> }} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).location(LocationType.ShipTrialSlot).location((l) => l.x === 1 || l.x === 4)],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      // Restricted to the adventure destination, not just the card: the bot is free to rest a card
      // instead of sending it on adventure whenever both are legal (it doesn't always prefer adventure —
      // see OdysseusBot.chooseCardMoves), and resting always grants a free skill-of-choice point on top
      // of whatever the card prints, needing a second, separate move this single-move step can't offer.
      // Trial9Strength's own gains are empty (see TutorialSetup), so once "adventure" is the only legal
      // destination, this move's whole resolution — pick, reveal, endTurn — completes as one consequence
      // chain with no further move required.
      move: {
        player: opponent,
        filter: (move, game) => this.isPlayCard(TrialCard.Trial9Strength, LocationType.PlayerAdventureColumn, move, game)
      }
    },
    {
      popup: { text: () => <Trans defaults="tuto.opponentPicked" components={{ ...BaseComponents, favor: <FavorIcon /> }} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(opponent),
          this.material(game, MaterialType.TrialCard).location(LocationType.ShipTrialSlot).locationId(ShipSide.Port).location((l) => l.x === 2 || l.x === 3)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.yourTurn" components={BaseComponents} /> },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.StoryTile).location(LocationType.PlayerTale)],
        margin: { top: 1, bottom: 1, left: 1, right: 1 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.taleScoring" components={{ ...BaseComponents, strength: skillComponents.strength }} /> },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.StoryTile).location(LocationType.PlayerTale).player(me),
          this.material(game, MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(me).locationId(Skill.Strength)
        ],
        margin: { top: 1, bottom: 1, left: 1, right: 1 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.taleMax" components={BaseComponents} /> },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(me)],
        locations: getEnumValues(Skill).map((skill) => ({ type: LocationType.PlayerAdventureColumn, player: me, id: skill, y: 0 })),
        margin: { top: 1, bottom: 1, left: 1, right: 1 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.taleGainIntro" components={BaseComponents} /> },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.StoryTile).location(LocationType.TaleDisplay),
          this.material(game, MaterialType.StoryTile).location(LocationType.TaleDeck)
        ],
        margin: { top: 1, bottom: 1, left: 1, right: 1 }
      })
    },
    {
      popup: {
        text: () => (
          <Trans
            defaults="tuto.taleGainRow"
            components={{ ...BaseComponents, strength: skillComponents.strength, intelligence: skillComponents.intelligence, cunning: skillComponents.cunning, luck: skillComponents.luck }}
          />
        )
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).location(LocationType.PlayerAdventureColumn).player(me)],
        locations: getEnumValues(Skill).map((skill) => ({ type: LocationType.PlayerAdventureColumn, player: me, id: skill, y: 0 })),
        margin: { top: 1, bottom: 1, left: 1, right: 1 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.taleFavorBuy" components={{ ...BaseComponents, favor: <FavorIcon /> }} />, position: { y: 25} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(me)],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      // The pile sits at the story board's far left edge (see PlayerRestPileLocator), so a tight,
      // default-centered popup would land right on top of it — pushed right (position.x) to leave it
      // uncovered.
      popup: { text: () => <Trans defaults="tuto.rest1" components={BaseComponents} />, position: { x: 25 } },
      focus: () => ({
        locations: [{ type: LocationType.PlayerRestPile, player: me }],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.rest2" components={{ ...BaseComponents, favor: <FavorIcon /> }} />, position: { x: 25 } },
      focus: () => ({
        locations: [{ type: LocationType.PlayerRestPile, player: me }],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.redirect1" components={{ ...BaseComponents, favor: <FavorIcon /> }} /> },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(me),
          this.material(game, MaterialType.SkillCube).player(me)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: {
        text: () => (
          <Trans
            defaults="tuto.redirectExample"
            components={{ ...BaseComponents, favor: <FavorIcon />, cunning: skillComponents.cunning, strength: skillComponents.strength }}
          />
        )
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(me),
          this.material(game, MaterialType.SkillCube).player(me)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.epic" components={{ ...BaseComponents, types: <AdventureTypeIcons /> }} />, position: { x: 20} },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.EpicTile).location(LocationType.EpicDeck)],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },
    {
      // The tutorial's last step, on purpose: once this move plays, stepComplete pushes game.tutorial.step
      // to steps.length, which turns the tutorial wrapper off entirely (see TutorialRulesWrapper.isTurnToPlay/
      // getLegalMoves — they fall back to the real rules once step >= steps.length). Any narration step placed
      // after a real move here would instead keep every player's moves gated behind that step's own `move`
      // filter, and since a plain narration step has none, it would silently block Poséidon's next full turn —
      // exactly the freeze this used to cause when "pickAny" sat earlier, still followed by rest/redirect/epic.
      popup: { text: () => <Trans defaults="tuto.finalCall" components={BaseComponents} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TrialCard).location(LocationType.ShipTrialSlot)],
        margin: { top: 2, bottom: 2, left: 1, right: 1 }
      }),
      move: {}
    }
  ]

  private isPlayCard(id: TrialCard, destination: LocationType, move: MaterialMove, game: MaterialGame): move is MoveItem {
    return (
      isMoveItemType(MaterialType.TrialCard)(move) &&
      move.itemIndex === this.material(game, MaterialType.TrialCard).id(id).getIndex() &&
      move.location.type === destination
    )
  }

  private isRaiseSkill(skill: Skill, move: MaterialMove, game: MaterialGame): move is MoveItem {
    return isMoveItemType(MaterialType.SkillCube)(move) && move.itemIndex === this.material(game, MaterialType.SkillCube).player(me).id(skill).getIndex()
  }
}

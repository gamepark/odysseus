import { css } from '@emotion/react'
import { LocationType } from '@gamepark/odysseus/material/LocationType'
import { MaterialType } from '@gamepark/odysseus/material/MaterialType'
import { AdventureType } from '@gamepark/odysseus/material/TrialCardStats'
import { OdysseusRules } from '@gamepark/odysseus/OdysseusRules'
import { skills } from '@gamepark/odysseus/Skill'
import { CounterProps, StyledPlayerPanel, useMaterialContext, usePlay, usePlayer, useRules } from '@gamepark/react-game'
import { getEnumValues, Location, MaterialMoveBuilder } from '@gamepark/rules-api'
import AthenaFavor from '../images/icons/AthenaFavor.png'
import { adventureTypeIcons, skillIcons } from '../images/Icons'
import { COUNTERS_PER_LINE, PANEL_SCALE, PANEL_WIDTH } from '../locators/PlayerPanelLayout'
import { showsAllTrials } from '../locators/PlayerRowLayout'

const adventureTypes = getEnumValues(AdventureType)

export const PlayerPanelContent = ({ location }: { location: Location<number> }) => {
  const rules = useRules<OdysseusRules>()!
  const play = usePlay()
  const context = useMaterialContext()
  const player = usePlayer<number>(location.player)
  // The player whose Trials are laid out above their board (see DisplayedPlayer): the framework's own
  // "view", which every locator reads back from the game. Nothing to select while everyone's Trials are
  // out at once — the panel is then just a read-out, sitting beside the board it belongs to.
  const selectable = !showsAllTrials(context)
  const displayedPlayer = rules.game.view ?? rules.players[0]
  if (!player) return null

  // Only the Trials taken on adventure carry their category: a Trial left to Rest is face down and
  // scores nothing, neither its skill nor its symbol (see OdysseusRules.getScoredCards).
  const adventureCards = rules.getScoredCards(player.id)

  // Two full lines of 5: the Trial symbols the Tale tiles score on, then what the player spends and
  // gathers — the 4 skill tracks and the Athena favors.
  const counters: CounterProps[] = [
    ...adventureTypes.map((adventureType) =>
      counter(adventureTypeIcons[adventureType], adventureCards.filter((card) => card.adventureType === adventureType).length)
    ),
    ...skills.map((skill) => counter(skillIcons[skill], rules.material(MaterialType.SkillCube).player(player.id).id(skill).getItem()?.location.x ?? 0)),
    counter(AthenaFavor, rules.material(MaterialType.AthenaFavorToken).location(LocationType.PlayerAthenaFavor).player(player.id).getQuantity())
  ]

  return (
    <StyledPlayerPanel
      player={player}
      counters={counters}
      countersPerLine={COUNTERS_PER_LINE}
      activeRing
      onClick={selectable ? () => play(MaterialMoveBuilder.changeView(player.id), { transient: true }) : undefined}
      css={[panelStyle, selectable && selectablePanel, selectable && player.id === displayedPlayer && selectedPanel]}
    />
  )
}

const counter = (image: string, value: number): CounterProps => ({ image, value, imageCss: counterIcon, extraCss: counterStyle })

/**
 * A badge is authored at 2.5em for a line of 3. The panel box is wide enough for 5 of them and then some
 * (see PlayerPanelLayout), so they are drawn larger than that — this is what the extra width is for, and
 * the only place it goes. Every tenth of an em here is paid for in height, on both lines at once: 3.4 is
 * where the two run out together, the badges filling their line just as the panel fills its share of the
 * table.
 */
const COUNTER_FONT_SIZE = 3.4

const counterStyle = css`
  font-size: ${COUNTER_FONT_SIZE}em;
  /* Keeps a value wider than its badge — a symbol gathered ten times over — from stretching its column
   * and pushing the whole line out of the panel. */
  min-width: 0;
`

/** Whatever room is left over goes between the icon and the value, never into shrinking the icon. */
const counterIcon = css`
  flex: none;
`

/**
 * The two sizes StyledPlayerPanel would rather have derive from one another (see PlayerPanelLayout):
 * `font-size` scales the content — 1em buys PANEL_SCALE table units — and `width` overrides the 28em box
 * it is authored in, so the box is PANEL_WIDTH units wide whatever the content is scaled at.
 */
const panelStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${PANEL_SCALE}em;
  width: ${PANEL_WIDTH / PANEL_SCALE}em;
`

const selectablePanel = css`
  cursor: pointer;
  /* PlayerPanelDescription is a LocationDescription, and LocationComponent sets pointer-events: none
   * on the whole location unless it has an onShortClick/onLongClick (from displayHelp), which this one
   * doesn't. That disables pointer-events for the entire subtree by inheritance, swallowing our onClick
   * below — restore it here. */
  pointer-events: auto;
`

const selectedPanel = css`
  outline: 0.3em solid gold;
  outline-offset: 0.2em;
`

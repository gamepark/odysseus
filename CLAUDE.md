# Game Park Framework - Instructions for Claude

This project uses the **Game Park framework** to create digital board games.

## Documentation

Official documentation: https://gamepark.github.io

For Claude to read the documentation, use raw GitHub URLs:
```
https://raw.githubusercontent.com/gamepark/gamepark.github.io/main/docs/[path]
```

### Key documentation files
| Topic | Path |
|-------|------|
| Core concepts | `concepts/core-concepts.md` |
| Items & Locations | `concepts/items-and-locations.md` |
| Hiding data | `concepts/hiding-data.md` |
| Item moves | `features/item-moves.md` |
| Rule moves | `features/rule-moves.md` |
| Custom moves | `features/custom-moves.md` |
| Location strategies | `features/location-strategies.md` |
| Hand of cards | `features/hand-of-cards.md` |
| Piles of items | `features/piles-of-items.md` |
| Tutorial AI | `features/tutorial-ai.md` |

### Step-by-step guide
The `step-by-step-example/` folder contains a complete tutorial:
1. `choose-a-game.md` → `set-up-your-computer.md` → `set-up-the-project.md`
2. `identify-the-players.md` → `identify-the-material.md` → `identify-the-locations.md`
3. `prepare-the-images.md` → `display-first-item.md` → `create-items.md`
4. `place-items.md` → `organize-the-table.md` → `hide-the-cards.md`
5. `identify-the-rules.md` → `player-turn.md` → `end-of-the-game.md`
6. `write-the-headers.md` → `help-dialogs.md` → `tutorial.md`

### Checklist
Full checklist: `step-by-step-example/checklist.md`

## Odysseus - Material

Rules: `app/public/rules-fr.pdf` and `rules-en.pdf`. 1 to 5 players (1 player = solo mode vs the Automa).

**There is no player color.** The 4 colors are the skills (`rules/src/Skill.ts`): red = Strength,
blue = Intelligence, yellow = Cunning, green = Luck. Every player owns one cube of each color.

### Copies of each component

Verified against the rules and by comparing the publisher files pixel by pixel.
Source artwork: `C:\Users\romai\kDrive\Licences\Gigamic\Odysseus\ASSETS`.

| Component | Copies | Distinct artworks | Images |
|---|---|---|---|
| Ship board (Navire d'Ulysse) | 1 | 1 | `boards/ShipBoard.jpg` |
| Story board (plateau Récit) | 5 | **1** — all identical, **2 glued layers** | `boards/StoryBoard.png` |
| Trial card (carte Épreuve) | 60 | **60 — all unique** | `cards/trials/` |
| Player aid card | 5 | **1** — all identical | `cards/PlayerAid{Front,Back}.jpg` |
| Automa card | 16 | unknown — fronts not delivered | `cards/automa/AutomaBack.jpg` |
| Story token (jeton Récit) | 28 | **14 types x 2 copies** + 1 common back | `tokens/story/` |
| Athena favor token | 40 | **1** — all identical | `tokens/AthenaFavor.png` |
| Epic tile (tuile Épopée) | 5 | 5 — values 2, 4, 6, 8, 10 | `tiles/epic/` |
| Automa difficulty tile | 4 | 4 — levels 1 to 4 | `tiles/automa/` |
| Wooden cube | 20 | 4 colors x 5 copies | `cubes/` |
| Score pad | 1 | 1 | `ScorePad.jpg` |

The 60 trial cards are **15 adventures x 4 skills**: source files 1-4 are adventure 1, 5-8 adventure 2,
and so on, always in the order yellow (Cunning), green (Luck), red (Strength), blue (Intelligence).
Hence the naming `Trial<1-15><Skill>.jpg`. The adventures are still numbered, not named.

Only a subset of the deck is used — 12 cards per player, read off the ship board:
**24 cards for 2 players, 36 for 3, 48 for 4, 60 for 5** (the whole deck).

**Epic and Automa difficulty tiles are double-sided**, which the punchboard versos reveal: the epic
tile showing 10 has a blank wooden back, the others pair up 8/4 and 6/2 (two tiles of each pair), and
the Automa tiles pair 1/3 and 2/4. Play never flips them — they are laid out on the wanted face — so
only the front artwork is extracted. The story token back is the only punched back that matters,
since those are the only pieces drawn face down.

### Image conventions

Sources are 300 dpi (118.11 px/cm), so physical sizes are read straight from the pixel count, after
cropping to the real die-cut box — backs are delivered on a 952 px canvas whose actual card is the
central 710 px (6 x 6 cm).

- **100 px = 1 cm** for cards, tiles and tokens
- **50 px = 1 cm** for the two large boards (same convention as `../les-jardins-suspendus`)
- PNGs (transparency) carry a **baked drop shadow**: canvas grown by 15 px per side, so the declared
  `width`/`height` grows by 0.30 cm in each direction.
- **Every card is a JPEG**, shadowless: the card renderer draws its own shadow and rounds the corners
  in CSS. The player aid was delivered die-cut with transparent corners, so the artwork was extended
  outward to fill them before flattening.
- **Cubes** (`cubes/`) come from the 3D renders, which already carry their own shadow. The flat
  Pantone swatches give the real size: 119 px = **1 x 1 cm cubes**. The render's top face measures
  257 x 259 px, hence a declared **1.65 x 1.67 cm** for the whole canvas so the cube itself reads 1 cm.
  Careful: the swatches and the 3D renders do NOT share the same colour order (03 and 04 are swapped).
- **The Story board is composed from its two layers**: `PLATEAU PERSO-1ST LAYER-2.png` (the parchment
  with the 4 skill tracks and the map) sits under `Die line PLATEAU PERSO-2ND LAYER - 2.png` (the wood
  and sea top layer, cut out where the cubes and the Trial cards go). Both crop to the same
  4489 x 910 box, so they align by bounding box. The cut edges cast a short soft shadow into each
  recess — blurred alpha of the top layer, kept only inside the holes — which is what gives the relief.
- **Icons** (`icons/`) are UI assets, not physical material: trimmed and capped at 256 px, no shadow.
  `Skills` is the four-coloured emblem standing for the cubes; `AthenaFavorFlat` is a stylised owl
  whose exact use is unconfirmed (`AthenaFavor` is the realistic token artwork).

### Missing assets

- **The 16 Automa card fronts.** Only the back was delivered; absent from `ASSETS`, `COM`,
  `VERSION FR` and `VERSION - EN`. Format deduced from the back: 6 x 6 cm.

Unused source files, kept in mind rather than extracted: `ODYSSEUS-COVER.jpg`, `FOND-DOS DE BOITE.jpg`,
`Odys_Plateau-bateau_mer_FINAL3-MER.jpg` (the sea layer of the ship board), `Odys_dauphins.psd`,
and the punchboard versos beyond the story token back.

## Project Structure

```
rules/src/                    # Server-side game logic
  ├── material/
  │   ├── MaterialType.ts     # Game components enum (start at 1)
  │   └── LocationType.ts     # Possible locations enum
  ├── rules/
  │   ├── RuleId.ts           # Game phases enum
  │   └── *Rule.ts            # Rule implementations
  ├── [Game]Rules.ts          # Main rules class
  ├── [Game]Setup.ts          # Initial game setup
  └── [Game]Options.ts        # Game configuration

app/src/                      # Client-side React UI
  ├── material/Material.ts    # Visual descriptions (sizes, images)
  ├── locators/Locators.ts    # Positioning on screen
  ├── headers/Headers.tsx     # In-game text display
  └── images/                 # Game assets
```

## Core Concepts

### MaterialItem
Every game element is an item with a location:
```typescript
{ id: CardId.Guard, location: { type: LocationType.PlayerHand, player: 1 } }
```

### Location properties
- `type`: LocationType (required)
- `player`: Owner player
- `id`: Location variant (e.g., which deck)
- `x`, `y`: Grid coordinates
- `parent`: Index of parent item
- `rotation`: Tile rotation

### Rules
- Extend `PlayerTurnRule` (one player acts) or `SimultaneousRule` (all players act)
- Implement `getPlayerMoves()` to define legal moves
- Use `afterItemMove()` or `onRuleStart()` for consequences
- Transition with `this.startRule(RuleId.Next)` or `this.endGame()`

## Development Workflow

1. **Define MaterialType** - List all physical components
2. **Define LocationType** - List all possible locations
3. **Implement Setup** - Create initial game state
4. **Implement Rules** - One file per game phase
5. **Configure Material.ts** - Sizes and images
6. **Create Locators** - Position items on screen
7. **Add Headers** - Display game text
8. **Test** - Use `game.new()`, `game.view`, `game.legalMoves` in browser console

## Console Commands (browser)

```javascript
game.new(playerCount)    // Start new game
game.view                // Current game state
game.legalMoves          // Available moves
game.undo()              // Undo last move
game.monkeyOpponents(true) // Auto-play opponents
```

## Patterns to Follow

### Creating items in Setup
```typescript
this.material(MaterialType.Card).createItems(
  cardIds.map(id => ({ id, location: { type: LocationType.Deck } }))
)
this.material(MaterialType.Card).shuffle()
```

### Player moves in Rule
```typescript
getPlayerMoves() {
  return this.material(MaterialType.Card)
    .location(LocationType.PlayerHand)
    .player(this.player)
    .moveItems({ type: LocationType.PlayArea })
}
```

### Consequences
```typescript
afterItemMove(move: ItemMove) {
  if (isMoveItem(move) && move.location.type === LocationType.PlayArea) {
    return [this.startRule(RuleId.ResolveCard)]
  }
  return []
}
```

## Reference Games

Similar games on GitHub (gamepark org) for inspiration:
- **Mythologies** - Complex drafting, multiple card types
- **Looot** - Hexagonal grid, tile placement
- **Along History** - Card game with effects
- **District Noir** - Simple card game

## Translations

Translation files are located in `app/public/translation/` (one JSON file per language: `en.json`, `fr.json`, `de.json`, `es.json`, `it.json`, `ru.json`). The project uses `i18next` + `react-i18next`.

### Translation workflow

**During development**: only write translations in the **developer's native language** file (e.g. `fr.json` for a French developer). Do not touch other language files — this saves tokens.

**Before production release**: when asked, translate all texts into every other supported language in a dedicated pass.

### Where translations are used
- `app/public/translation/*.json` — UI texts (headers, dialogs, tooltips, buttons)
- `Headers.tsx` — uses `useTranslation()` to display in-game messages
- `materialI18n` prop on `GameProvider` — localized material descriptions

### Translation keys convention
Follow existing key naming patterns in the JSON files. Keep keys descriptive and organized by feature/screen.

## When Helping

1. **Always read existing code first** before suggesting changes
2. **Follow established patterns** in the codebase
3. **Test incrementally** - suggest testing after each major change
4. **Reference documentation** when explaining concepts
5. **Start with MaterialType/LocationType** for new games

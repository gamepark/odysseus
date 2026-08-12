import { Locator } from '@gamepark/react-game'

// Turned a quarter to the left so the bow — the ram, on the right of the artwork — points up: the board
// then reads 24.52 wide by 49.02 tall and takes the whole left of the table (see TableLayout), leaving
// the right side free for the player area. Everything printed on the board (Trial slots, decks, Tale
// display) is positioned in percentages of the board itself, so it all turns with it.
export const shipBoardPlaceLocator = new Locator({ coordinates: { x: -23.7, y: 0 }, rotateZ: -90 })

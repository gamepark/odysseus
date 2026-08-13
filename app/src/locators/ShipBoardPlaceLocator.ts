import { Locator } from '@gamepark/react-game'
import { SHIP_BOARD_X } from './TableLayout'

// The board is laid out bow up, so it reads 24.52 wide by 49.02 tall and takes the whole left of the
// table (see TableLayout), leaving the right side free for the player area. The quarter turn is baked
// into ShipBoard.jpg — the file is stored bow up — rather than applied here, so that no locator on the
// board has to undo it: percentages and rotations are all read straight off the image as it is drawn.
export const shipBoardPlaceLocator = new Locator({ coordinates: { x: SHIP_BOARD_X, y: 0 } })

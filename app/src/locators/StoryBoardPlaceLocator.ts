import { Locator } from '@gamepark/react-game'

// Only one Story board is ever on the table (see StoryBoardDescription), so it always sits in the same
// spot, below the ship board. Every other player-owned locator offsets from this one.
export const storyBoardPlaceLocator = new Locator({ coordinates: { x: 0, y: 20 } })

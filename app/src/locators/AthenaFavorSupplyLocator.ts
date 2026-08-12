import { PileLocator } from '@gamepark/react-game'

// A generic supply pile, heaped at the ship's stern — which the board turned bow up (see
// ShipBoardPlaceLocator) puts at the bottom of the table — just below the Epic tiles, the last thing
// printed there. The whole right of the table belongs to the players' boards now, so it has nowhere else
// to go; the hull has already tapered off at that point, so the pile is kept tight (small radius) and
// still spills a little over the gunwale.
export const athenaFavorSupplyLocator = new PileLocator({ coordinates: { x: -23.7, y: 19.6, z: 1 }, radius: 1.1 })

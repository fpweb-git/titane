/**
 * Component marking an entity as being controllable by the player's input.
 */
export const PLAYER_CONTROLLED_ID = 'player-controlled';

export interface PlayerControlled {
    // This is currently a tag component with no internal data.
    // Entities possessing this component ID are deemed player-controlled.
    _active?: boolean; 
}

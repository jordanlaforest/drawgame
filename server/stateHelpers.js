export function getPlayer(state, playerId){
  return state.get('players').get(playerId);
}
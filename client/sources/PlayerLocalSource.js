import Marty from 'marty';

import Player from '../../common/Player';
import { NAME_CHANGE_EVENT } from '../../common/EventConstants';

var PlayerLocalSource = Marty.createStateSource({
  type: 'localStorage',
  namespace: 'player.',

  player: new Player({ id: 0, name: '', score: 0}),

  setName (name, socket = null) {
    this.player.name = name;
    this.set('name', name);

    if(socket) {
      socket.emit(NAME_CHANGE_EVENT, this.player.name);
    }
  },
  getName() {
    return this.get('name');
  }
});

export default PlayerLocalSource;

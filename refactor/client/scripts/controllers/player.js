import { INIT_EVENT, NAME_CHANGE_EVENT } from '../../../common/EventConstants';
import Player from '../../../common/Player';

let app = angular.module('drawgameApp');
const LOCAL_STORAGE_KEY = 'player.name';

const PROMPT_MSG        = 'Please choose a name:';
const INVALID_NAME_MSG  = 'Invalid name, please try again.';

class PlayerController {

  constructor(socket) {
    this.player = new Player({ name : '', score: 0 });
    this.socket = socket;

    this.promptForName();
  }

  isValid(name) {
    return !!name;
  }

  setName(name) {
    if(this.isValid(name)) {
      this.player.name = name;
      localStorage.set(LOCAL_STORAGE_KEY, this.player.name);
      this.socket.emit(NAME_CHANGE_EVENT, this.player.name);
    }
  }

  promptForName() {
    let name = localStorage.getItem('player.name') ;
    if(name !== undefined ) {
      this.player.name = name;
    } else {
      do {
        this.player.name = prompt(PROMPT_MSG);
        let invalid = !this.isValid(this.player.name);
        // block scoped variable
        if(invalid) {
          alert(INVALID_NAME_MSG);
        }
      } while(invalid);

      localStorage.setItem(LOCAL_STORAGE_KEY, this.player.name);
    }

    this.socket.emit(INIT_EVENT, this.player);
  }
}

app.controller('PlayerCtrl', function($scope, socket){
  $scope.name     = localStorage.getItem('player.name');

  let controller = new PlayerController(socket);
});
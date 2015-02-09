import Marty from 'marty';

var DrawingConstants = Marty.createConstants([
  //receive from server
  'PEN_DOWN',
  'PEN_UP',
  'PEN_MOVE',
  //send to server
  'SEND_PEN_DOWN',
  'SEND_PEN_UP',
  'SEND_PEN_MOVE'
]);

export default DrawingConstants;

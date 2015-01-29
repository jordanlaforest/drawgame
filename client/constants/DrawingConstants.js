import Marty from 'marty';

var DrawingConstants = Marty.createConstants([
  //receive from server
  'PATH_START',
  'PATH_END',
  'PATH_MOVE',
  //send to server
  'SEND_PATH_START',
  'SEND_PATH_END',
  'SEND_PATH_MOVE'
]);

export default DrawingConstants;

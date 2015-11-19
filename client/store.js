import {createStore} from 'redux';
import reducer from '../common/reducers/reducers';

export default function makeStore() {
  return createStore(reducer);
}
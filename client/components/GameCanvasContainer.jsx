import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PropTypes from 'prop-types';
import {List, Map} from 'immutable';
import {connect} from 'react-redux';

import {sendAddPoint, sendEndPath, getTimerSeconds} from '../../common/modules/game';
import {isDebugEnabled} from '../modules/debug';
import Canvas from './Canvas.jsx';

class GameCanvasContainer extends React.Component {
  render() {
    let currentWord = this.props.currentWord;
    let amIDrawing = this.props.playerId === this.props.currentlyDrawing.get('id');
    let name = amIDrawing ? '' : this.props.currentlyDrawing.get('name');
    let winMsg = this.props.winner ? this.props.winner.get('name') + ' has won the game!' : '';

    let canvasHeader;
    if(!this.props.gameHasStarted){
      canvasHeader = <span>Please wait for the game to start.</span>;
    }else if(this.props.gameInIntermission){
      canvasHeader = <span>The correct answer was&nbsp;<strong>{currentWord}</strong>. {winMsg}</span>;
    }else{
      if(amIDrawing){
        canvasHeader = <span>Your word is&nbsp;<strong>{currentWord}</strong></span>;
      }else{
        canvasHeader = <span><strong>{name}</strong>&nbsp;is currently drawing</span>;
      }
    }
    return (
      <Panel>
        <Panel.Heading className="text-center">
          {canvasHeader}
          <span className="pull-right">{this.props.timer}</span>
        </Panel.Heading>
        <Panel.Body>
          <Canvas
            paths={this.props.paths}
            addPoint={this.props.addPoint}
            endPath={this.props.endPath}
            debugEnabled={this.props.debugEnabled}>
          </Canvas>
        </Panel.Body>
      </Panel>
    );
  }
}

GameCanvasContainer.propTypes = {
  currentlyDrawing: PropTypes.instanceOf(Map).isRequired,
  currentWord: PropTypes.string.isRequired,
  gameHasStarted: PropTypes.bool.isRequired,
  gameInIntermission: PropTypes.bool.isRequired,
  winner: PropTypes.object,
  paths: PropTypes.instanceOf(List).isRequired,
  playerId: PropTypes.string.isRequired,
  addPoint: PropTypes.func.isRequired,
  endPath: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  debugEnabled: PropTypes.bool
};

export default connect(
  state => {
    let game = state.game;
    return {
      currentlyDrawing: state.players.get(game.players.get(game.currentlyDrawingPlayer).get('id')),
      currentWord: game.currentWord,
      gameHasStarted: game.isStarted,
      gameInIntermission: game.inIntermission,
      winner: game.winner ? state.players.get(game.players.get(game.winner).get('id')) : undefined,
      playerId: state.auth.playerId,
      paths: game.get('drawingData').get('paths').push(game.get('drawingData').get('curPath')),
      timer: getTimerSeconds(game),
      debugEnabled: isDebugEnabled(state.debug)
    };
  },
  dispatch => {
    return {
      addPoint: point => dispatch(sendAddPoint(point)),
      endPath: () => dispatch(sendEndPath())
    };
  }
)(GameCanvasContainer);

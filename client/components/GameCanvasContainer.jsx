import React from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import {List, Map} from 'immutable';
import {connect} from 'react-redux';

import {sendAddPoint, sendEndPath} from '../../common/modules/game';
import Canvas from './Canvas.jsx';

class GameCanvasContainer extends React.Component {
  render() {
    let currentWord = this.props.currentWord;
    let amIDrawing = this.props.playerId === this.props.currentlyDrawing.get('id');
    let name = amIDrawing ? '' : this.props.currentlyDrawing.get('name');

    let canvasHeader;
    if(!this.props.gameHasStarted){
      canvasHeader = <p>Please wait for the game to start.</p>;
    }else if(this.props.gameInIntermission){
      canvasHeader = <p>The correct answer was <strong>{currentWord}</strong></p>;
    }else{
      if(amIDrawing){
        canvasHeader = <p>Your word is <strong>{currentWord}</strong></p>;
      }else{
        canvasHeader = <p><strong>{name}</strong> is currently drawing</p>;
      }
    }
    return (
      <Card header={ canvasHeader }>
        <Canvas
          paths={this.props.paths}
          addPoint={this.props.addPoint}
          endPath={this.props.endPath}>
        </Canvas>
      </Card>
    );
  }
}

GameCanvasContainer.propTypes = {
  currentlyDrawing: PropTypes.instanceOf(Map).isRequired,
  currentWord: PropTypes.string.isRequired,
  gameHasStarted: PropTypes.bool.isRequired,
  gameInIntermission: PropTypes.bool.isRequired,
  paths: PropTypes.instanceOf(List).isRequired,
  playerId: PropTypes.string.isRequired,
  addPoint: PropTypes.func.isRequired,
  endPath: PropTypes.func.isRequired
};

export default connect(
  state => {
    let game = state.game;
    return {
      currentlyDrawing: state.players.get(game.players.get(game.currentlyDrawingPlayer).get('id')),
      currentWord: game.currentWord,
      gameHasStarted: game.isStarted,
      gameInIntermission: game.inIntermission,
      playerId: state.auth.playerId,
      paths: game.get('drawingData').get('paths').push(game.get('drawingData').get('curPath'))
    };
  },
  dispatch => {
    return {
      addPoint: point => dispatch(sendAddPoint(point)),
      endPath: () => dispatch(sendEndPath())
    };
  }
)(GameCanvasContainer);

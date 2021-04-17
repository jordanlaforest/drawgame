import React from 'react';
import PropTypes from 'prop-types';

import {Map} from 'immutable';

import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { ENTER_KEY_CODE } from '../../common/constants';

class LobbyCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {password: ''};
  }

  render() {
    let game = this.props.game;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">{game.get('password') ? <Glyphicon glyph="lock" /> : <div></div> }<b>{game.get('name')}</b></Panel.Title>
        </Panel.Heading>
        <Panel.Body>{game.get('players').size + '/' + game.get('maxPlayers')} players</Panel.Body>
        <Panel.Footer>
          <InputGroup>
            {game.get('password') ? 
              <FormControl
                type="text"
                placeholder="Password"
                onChange={this.onChange}
                value={this.state.password}
                onKeyDown={this.onKeyDown}
              />
              : null
            }
            <InputGroup.Button>
              <Button id='joinBtn' bsStyle='primary' onClick={() => this.props.joinGame(game.get('id'))}>
                {this.props.joining ? 'Joining' : 'Join'}
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </Panel.Footer>
      </Panel>
    );
  }

  onChange = (event) => {
    this.setState({password: event.target.value});
  }

  onKeyDown = ({ keyCode }) => {
    if(keyCode === ENTER_KEY_CODE) {
      this.submit();
    }
  }

  submit = () => {
    this.props.joinGame(this.props.game.get('id'));
    this.setState({password: ''});
  }
}

LobbyCard.propTypes = {
  joinGame: PropTypes.func.isRequired,
  game: PropTypes.instanceOf(Map).isRequired,
  joining: PropTypes.bool.isRequired
};

export default LobbyCard;
import React, { useState, useCallback } from 'react';
import { Button, Card, Col, Row, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


const numPlayersOptions = [2, 3];


const HomePage = ({ roomInfo }) => {
  const [numPlayers, setNumPlayers] = useState(numPlayersOptions[0]);
  const onChangeNumPlayers = useCallback(
    eventKey => {
      setNumPlayers(parseInt(eventKey, 10));
    },
    [setNumPlayers],
  );

  let reconnectRow = null;
  // TODO: Have some mechanism by which the Reconnect button is removed when it
  //       no longer works.
  if(roomInfo.roomId && roomInfo.sessionId) {
    reconnectRow = (
      <Row className="mt-2">
        <Col>
          <Button as={Link} to={`/reconnect/${roomInfo.roomId}/${roomInfo.sessionId}`} variant="warning" block>Reconnect</Button>
        </Col>
      </Row>
    );
  }

  return (
    <Card style={{ maxWidth: 320, margin: 'auto' }} body>
      <Row>
        <Col>
          <h1>Jackalope</h1>
        </Col>
      </Row>
      {reconnectRow}
      <Row className="mt-2">
        <Col>
          <DropdownButton
            as={ButtonGroup}
            variant="secondary"
            title={`${numPlayers} Players`}
          >
            {numPlayersOptions.map(n => (
              <Dropdown.Item
                key={n}
                eventKey={n}
                onSelect={onChangeNumPlayers}
                active={numPlayers === n}
              >
                {`${n} Players`}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Button as={Link} to={`/join-public/${numPlayers}`} block>Find a match</Button>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Button as={Link} to={`/create-private/${numPlayers}`} variant="outline-primary" block>Create a private game</Button>
        </Col>
      </Row>
    </Card>
  );
};


export default connect(state => {
  const { roomInfo } = state;
  return { roomInfo };
})(HomePage);

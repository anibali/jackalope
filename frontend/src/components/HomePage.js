import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const HomePage = () => (
  <Card style={{ maxWidth: 320, margin: 'auto' }} body>
    <Row>
      <Col>
        <h1>Jackalope</h1>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <Button as={Link} to="/join-public" block>Find a match</Button>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <Button as={Link} to="/create-private" variant="outline-primary" block>Create a private game</Button>
      </Col>
    </Row>
  </Card>
);


export default HomePage;

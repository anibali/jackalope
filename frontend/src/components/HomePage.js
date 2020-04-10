import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => (
  <div>
    <ul>
      <li><Link to="/create-private">Create private game</Link></li>
      <li><Link to="/join-public">Join public game</Link></li>
    </ul>
  </div>
);


export default HomePage;

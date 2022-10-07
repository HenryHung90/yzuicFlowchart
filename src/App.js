import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import GOGO from './views/GOGO'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<GOGO />} />
      </Routes>
    </Router>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import de BrowserRouter pour pouvoir faire nos routes

import Home from './components/home';
import Home2 from './components/home2';


function App() {
  return (
    <div className="App">
      <Router> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home/*" element={<Home2 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

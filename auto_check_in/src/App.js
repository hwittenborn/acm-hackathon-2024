import { useState } from 'react';
import './App.css';
import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import {Home} from "./Pages/home"
import { VideoFeed } from './Pages/videoFeed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/feed" element={<VideoFeed/>}/>
      </Routes>
    </Router>
  )
}

export default App;

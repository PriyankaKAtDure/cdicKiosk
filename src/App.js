import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from './Start';
import Patient from './Patient';
import Forms from './Forms';

function App() {
  return (
    <div>
      <Router basename="/">
      
          <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/Patient" element={<Patient />} />
          <Route path="/Forms" element={<Forms />} />
          </Routes>
    
      </Router> 
    </div>
  )
}

export default App
